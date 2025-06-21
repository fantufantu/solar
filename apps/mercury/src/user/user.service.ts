import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, In, Like, Not } from 'typeorm';
import dayjs from 'dayjs';
import { Client as SesClient } from 'tencentcloud-sdk-nodejs/tencentcloud/services/ses/v20201002/ses_client';
import {
  CacheToken,
  ConfigurationRegisterToken,
  TencentCloudPropertyToken,
} from 'assets/tokens';
import { PlutoClientService } from '@/libs/pluto-client';
import type { VerifyBy } from './dto/verify-by.input';
import { UpdateUserBy } from './dto/update-user-by.input';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { CacheService } from '@/libs/cache';

@Injectable()
export class UserService {
  private sesClient: SesClient;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly plutoClient: PlutoClientService,
    private readonly cacheService: CacheService,
  ) {
    this.initializeSesClient();
  }

  /**
   * @author murukal
   * @description 发送注册验证码
   */
  async sendCaptcha(to: string, token: CacheToken): Promise<Date> {
    // 节流：上次发送时间距离当前系统时间在1分钟内，则抛出异常
    const systemTimeAt = dayjs();
    const { 1: sentAt } =
      (await this.cacheService
        .getCaptchaValidation(to, token)
        .catch(() => null)) ?? [];

    if (!!sentAt && systemTimeAt.diff(dayjs(sentAt), 'minutes') < 1) {
      throw new Error('验证码发送太频繁，请稍后再试');
    }

    const captcha = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    // 执行发送邮件
    const { MessageId, RequestId } = await this.sesClient.SendEmail({
      FromEmailAddress: 'no-replay@account.fantufantu.com',
      Destination: [to],
      Subject: '通过邮件确认身份',
      Template: {
        TemplateID: 28985,
        TemplateData: JSON.stringify({
          captcha,
        }),
      },
    });

    if (!MessageId || !RequestId) {
      throw new Error(
        `邮件发送失败: MessageId(${MessageId}) RequestId(${RequestId})`,
      );
    }

    // 利用缓存记录验证码，有效期5分钟
    this.cacheService.setCaptchaValidation(to, token, [
      captcha,
      systemTimeAt.toDate(),
    ]);

    return systemTimeAt.toDate();
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
  async verify(
    verifyBy: VerifyBy,
    token: CacheToken = CacheToken.RegisterCaptcha,
  ) {
    const { 0: sent } =
      (await this.cacheService.getCaptchaValidation(
        verifyBy.verifiedBy,
        token,
      )) ?? [];

    if (!sent || sent !== verifyBy.captcha) {
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

  /**
   * @author murukal
   * @description 修改密码
   */
  async changePassword(who: string, password: string) {
    const _user = await this.getUser(who);
    if (!_user) throw new UnauthorizedException('用户不存在');

    await this.userRepository.update(_user.id, {
      password,
    });
  }
}
