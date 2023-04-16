import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { SendCaptchaBy } from './dto/send-captcha-by.input';
import { UserVerification } from './entities/user-verification.entity';
import { User } from './entities/user.entity';
import dayjs = require('dayjs');
import { Client as SesClient } from 'tencentcloud-sdk-nodejs/tencentcloud/services/ses/v20201002/ses_client';
import { ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface';
import { ConfigRegisterToken, TencentCloudPropertyToken } from 'assets/tokens';
import { PlutoClientService } from '@app/pluto-client';
import type { VerifyBy } from './dto/verify-by.input';

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
   * 获取或创建 UserVerification 对象
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
   * 发送验证码
   */
  async sendCaptcha(sendCaptchaBy: SendCaptchaBy): Promise<Date> {
    // 加载 userVerification
    const userVerification = await this.getOrCreate(sendCaptchaBy);

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
      Destination: [sendCaptchaBy.to],
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
   * 获取单个用户
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
    const user = await this.userRepository.findOne({
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

    return user;
  }

  /**
   * 验证用户邮箱
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
   * 创建用户
   */
  async create(user: Partial<User>) {
    return this.userRepository.save(this.userRepository.create(user));
  }

  /**
   * 初始化 ses client (发送邮件)
   */
  private async initializeSesClient() {
    const clientConfig: ClientConfig = {
      credential: {
        secretId: await this.plutoClient.getConfig<string>({
          token: ConfigRegisterToken.TencentCloud,
          property: TencentCloudPropertyToken.SecretId,
        }),
        secretKey: await this.plutoClient.getConfig<string>({
          token: ConfigRegisterToken.TencentCloud,
          property: TencentCloudPropertyToken.SecretKey,
        }),
      },
      region: 'ap-hongkong',
    };

    this.sesClient = new SesClient(clientConfig);
  }
}
