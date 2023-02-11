import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { SendCaptchaArgs } from './dto/send-captcha.args';
import { UserEmail } from './entities/user-email.entity';
import { User } from './entities/user.entity';
import dayjs = require('dayjs');
import { Client as SesClient } from 'tencentcloud-sdk-nodejs/tencentcloud/services/ses/v20201002/ses_client';
import { ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface';
import { ConfigRegisterToken, TencentCloudPropertyToken } from 'assets/tokens';
import { PlutoClientService } from '@app/pluto-client';

@Injectable()
export class UserService {
  private sesClient: SesClient;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserEmail)
    private readonly userEmailRepository: Repository<UserEmail>,
    private readonly plutoClient: PlutoClientService,
  ) {
    this.initializeSesClient();
  }

  /**
   * 获取userEmail对象
   * 不存在则创建
   */
  async getOrGenerateUserEmail(emailAddress: string): Promise<UserEmail> {
    // 尝试获取存在的用户邮件信息
    const userEmail = await this.userEmailRepository.findOneBy({
      address: emailAddress,
    });
    // 不存在，执行创建后返回
    if (!userEmail) {
      return await this.userEmailRepository.save(
        this.userEmailRepository.create({
          address: emailAddress,
        }),
      );
    }
    // 验证码存在有效期，验证码失效时，需要重新生成验证码
    if (dayjs().isAfter(userEmail.validTo)) {
      userEmail.generateCaptcha();
      userEmail.sentAt = null;
      this.userEmailRepository.save(userEmail);
    }
    return userEmail;
  }

  /**
   * 发送验证码
   */
  async sendCaptcha(sendCaptchaArgs: SendCaptchaArgs): Promise<Date> {
    // 获取userEmail对象
    // 不存在则创建，存在则获取
    const userEmail = await this.getOrGenerateUserEmail(
      sendCaptchaArgs.emailAddress,
    );

    // 每1分钟仅可发送一次
    if (
      userEmail.sentAt &&
      dayjs().subtract(1, 'minute').isBefore(userEmail.sentAt)
    ) {
      throw new Error('验证码发送太频繁，请稍后再试');
    }

    // 执行发送邮件
    const params = {
      FromEmailAddress: 'no-replay@account.fantufantu.com',
      Destination: [sendCaptchaArgs.emailAddress],
      Subject: '通过邮件确认身份',
      Template: {
        TemplateID: 28985,
        TemplateData: JSON.stringify({
          captcha: userEmail.captcha,
        }),
      },
    };

    const currentSentAt = dayjs().toDate();
    await this.sesClient.SendEmail(params);

    // 发送失败会直接抛出异常
    // 执行到这 = 发送成功
    // 更新上次发送时间
    await this.userEmailRepository.update(sendCaptchaArgs.emailAddress, {
      sentAt: dayjs().toDate(),
    });

    return currentSentAt;
  }

  /**
   * 获取单个用户
   */
  async getUser(
    keyword: number | string,
    options?: Pick<FindOneOptions<User>, 'select' | 'relations'>,
  ) {
    // keyword 为空：抛出异常
    if (!keyword) {
      throw new Error('用户关键字不能为初始值！');
    }

    // 查询指定用户
    const user = await this.userRepository.findOne({
      ...options,
      where: [
        {
          id: keyword as number,
        },
        {
          username: keyword as string,
        },
        {
          emailAddress: keyword as string,
        },
      ],
    });

    return user;
  }

  /**
   * 验证用户邮箱
   */
  async verify(verifyInput: { emailAddress: string; captcha: string }) {
    const isVerified = !!(
      await this.userEmailRepository
        .createQueryBuilder()
        .update()
        .set({
          isVerified: true,
        })
        .where({
          address: verifyInput.emailAddress,
          captcha: verifyInput.captcha,
        })
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
