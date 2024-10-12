import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, In, Like, Not } from 'typeorm';
import { SendCaptchaBy } from './dto/send-captcha-by.input';
import dayjs from 'dayjs';
import { Client as SesClient } from 'tencentcloud-sdk-nodejs/tencentcloud/services/ses/v20201002/ses_client';
import {
  CacheToken,
  ConfigurationRegisterToken,
  TencentCloudPropertyToken,
} from 'assets/tokens';
import { PlutoClientService } from '@/lib/pluto-client';
import type { VerifyBy } from './dto/verify-by.input';
import { UpdateUserBy } from './dto/update-user-by.input';
import { User } from '@/lib/database/entities/mercury/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { toCacheKey } from 'utils/cache';

@Injectable()
export class UserService {
  private sesClient: SesClient;

  constructor(
    @InjectRepository(User)
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly userRepository: Repository<User>,
    private readonly plutoClient: PlutoClientService,
  ) {
    this.initializeSesClient();
  }

  /**
   * @author murukal
   * @description 发送验证码
   */
  async sendCaptcha(sendBy: SendCaptchaBy): Promise<Date> {
    // 节流
    const sent = await this.cacheManager
      .get<string>(toCacheKey(CacheToken.Captcha, sendBy.to))
      .catch(() => null);
    if (sent) {
      throw new Error('验证码发送太频繁，请稍后再试');
    }

    const captcha = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    // 执行发送邮件
    const sendEmailBy = {
      FromEmailAddress: 'no-replay@account.fantufantu.com',
      Destination: [sendBy.to],
      Subject: '通过邮件确认身份',
      Template: {
        TemplateID: 28985,
        TemplateData: JSON.stringify({
          captcha,
        }),
      },
    };

    const { MessageId, RequestId } =
      await this.sesClient.SendEmail(sendEmailBy);

    if (!MessageId || !RequestId) {
      throw new Error(
        `邮件发送失败: MessageId(${MessageId}) RequestId(${RequestId})`,
      );
    }

    // 利用缓存记录验证码，有效期5分钟
    this.cacheManager.set(
      toCacheKey(CacheToken.Captcha, sendBy.to),
      captcha,
      5 * 60 * 1000,
    );

    return dayjs().toDate();
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
    const _captcha = await this.cacheManager
      .get<string>(toCacheKey(CacheToken.Captcha, verifyBy.verifiedBy))
      .catch(() => null);

    if (!_captcha || _captcha !== verifyBy.captcha) {
      throw new Error('邮箱验证失败，请检查验证码');
    }

    return true;
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
    const [secretId, secretKey, region] = await Promise.all([
      this.plutoClient.getConfiguration<string>({
        token: ConfigurationRegisterToken.TencentCloud,
        property: TencentCloudPropertyToken.SecretId,
      }),
      this.plutoClient.getConfiguration<string>({
        token: ConfigurationRegisterToken.TencentCloud,
        property: TencentCloudPropertyToken.SecretKey,
      }),
      this.plutoClient.getConfiguration<string>({
        token: ConfigurationRegisterToken.TencentCloud,
        property: TencentCloudPropertyToken.SesRegion,
      }),
    ]);

    this.sesClient = new SesClient({
      credential: {
        secretId,
        secretKey,
      },
      region,
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
