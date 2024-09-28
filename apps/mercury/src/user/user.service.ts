import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, In, Like, Not } from 'typeorm';
import { SendCaptchaBy } from './dto/send-captcha-by.input';
import dayjs from 'dayjs';
import { Client as SesClient } from 'tencentcloud-sdk-nodejs/tencentcloud/services/ses/v20201002/ses_client';
import {
  ConfigurationRegisterToken,
  TencentCloudPropertyToken,
} from 'assets/tokens';
import { PlutoClientService } from '@/lib/pluto-client';
import type { VerifyBy } from './dto/verify-by.input';
import { UpdateUserBy } from './dto/update-user-by.input';
import { UserVerification } from '@/lib/database/entities/mercury/user-verification.entity';
import { User } from '@/lib/database/entities/mercury/user.entity';

@Injectable()
export class UserService {
  private sesClient: SesClient;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserVerification)
    private readonly userVerificationRepository: Repository<UserVerification>,
    private readonly plutoClient: PlutoClientService,
  ) {
    this.initializeSesClient();
  }

  /**
   * @author murukal
   * @description 获取或创建 UserVerification 对象
   */
  async getOrCreate(sendCaptchaBy: SendCaptchaBy): Promise<UserVerification> {
    // 尝试获取存在的用户邮件信息
    const userVerification =
      (await this.userVerificationRepository.findOneBy({
        verifiedBy: sendCaptchaBy.to,
        type: sendCaptchaBy.type,
      })) ||
      this.userVerificationRepository
        .create({
          verifiedBy: sendCaptchaBy.to,
          type: sendCaptchaBy.type,
        })
        .reload();

    // 验证码存在有效期，验证码失效时，需要重新生成验证码
    if (dayjs().isAfter(userVerification.validTo)) {
      userVerification.reload();
    }

    return userVerification;
  }

  /**
   * @author murukal
   * @description 发送验证码
   */
  async sendCaptcha(sendBy: SendCaptchaBy): Promise<Date> {
    // 加载 userVerification
    const userVerification = await this.getOrCreate(sendBy);

    // 每1分钟仅可发送一次
    if (
      userVerification.sentAt &&
      dayjs().subtract(1, 'minute').isBefore(userVerification.sentAt)
    ) {
      throw new Error('验证码发送太频繁，请稍后再试');
    }

    // 执行发送邮件
    const sendEmailBy = {
      FromEmailAddress: 'no-replay@account.fantufantu.com',
      Destination: [sendBy.to],
      Subject: '通过邮件确认身份',
      Template: {
        TemplateID: 28985,
        TemplateData: JSON.stringify({
          captcha: userVerification.captcha,
        }),
      },
    };

    await this.sesClient.SendEmail(sendEmailBy);
    // 发送成功，设置已发送时间
    userVerification.sentAt = dayjs().toDate();

    // 发送失败会直接抛出异常
    // 执行到这 = 发送成功
    // 更新上次发送时间
    await this.userVerificationRepository.upsert(userVerification, [
      'verifiedBy',
      'type',
    ]);

    return userVerification.sentAt;
  }

  /**
   * @author murukal
   * @description 查询单个用户
   */
  async getUser(
    who: number | string,
    options?: Pick<FindOneOptions<User>, 'select' | 'relations'>,
  ) {
    // who 为空：抛出异常
    if (!who) {
      throw new Error('用户凭证不能为空！');
    }

    // 查询指定用户
    return await this.userRepository.findOne({
      ...options,
      where: [
        {
          id: who as number,
        },
        {
          username: who as string,
        },
        {
          emailAddress: who as string,
        },
      ],
    });
  }

  /**
   * @author murukal
   * @description 验证用户邮箱
   */
  async verify(verifyBy: VerifyBy) {
    const isVerified = !!(
      await this.userVerificationRepository
        .createQueryBuilder()
        .update()
        .set({
          isVerified: true,
        })
        .where(verifyBy)
        .execute()
    ).affected;

    if (!isVerified) throw new Error('邮箱验证失败，请检查验证码');
  }

  /**
   * @author murukal
   * @description 创建用户
   */
  async create(user: Partial<User>) {
    return this.userRepository.save(this.userRepository.create(user));
  }

  /**
   * @author murukal
   * @description
   * 初始化 ses client (发送邮件)
   */
  private async initializeSesClient() {
    const [secretId, secretKey] = await Promise.all([
      this.plutoClient.getConfiguration<string>({
        token: ConfigurationRegisterToken.TencentCloud,
        property: TencentCloudPropertyToken.SecretId,
      }),
      this.plutoClient.getConfiguration<string>({
        token: ConfigurationRegisterToken.TencentCloud,
        property: TencentCloudPropertyToken.SecretKey,
      }),
    ]);

    this.sesClient = new SesClient({
      credential: {
        secretId,
        secretKey,
      },
      region: 'ap-hongkong',
    });
  }

  /**
   * @author murukal
   * @description 根据用户id批量查询用户信息
   */
  async getUsersByIds(ids: number[]) {
    return await this.userRepository.findBy({
      id: In(ids),
    });
  }

  /**
   * @author murukal
   * @description 查询用户列表
   */
  async getUsersByWho(who: string, exclude: number) {
    const likeBy = `%${who}%`;

    // 查询指定用户
    return await this.userRepository.findBy([
      {
        username: Like(likeBy),
        id: Not(exclude),
      },
      {
        emailAddress: Like(likeBy),
        id: Not(exclude),
      },
    ]);
  }

  /**
   * @author murukal
   * @description 更新用户信息
   */
  async updateUser(id: number, updateBy: UpdateUserBy) {
    return !!(
      await this.userRepository.update(id, this.userRepository.create(updateBy))
    ).affected;
  }
}
