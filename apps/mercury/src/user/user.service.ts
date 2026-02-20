import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOneOptions,
  In,
  EntityManager,
  Brackets,
} from 'typeorm';
import dayjs from 'dayjs';
import { Client as SesClient } from 'tencentcloud-sdk-nodejs/tencentcloud/services/ses/v20201002/ses_client';
import { CacheToken, ConfigurationRegisterToken } from 'assets/tokens';
import { PlutoClientService } from '@/libs/pluto-client';
import { VerifyInput } from './dto/verify.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { CacheService } from '@/libs/cache';
import { TENCENT_CLOUD_CONFIGURATION } from 'constants/cloud';
import { Pagination } from 'assets/dto/pagination.input';
import { FilterUserInput } from './dto/filter-user.input';
import { RoleWithUser } from '@/libs/database/entities/mercury/role-with-user.entity';
import { RoleWithAuthorization } from '@/libs/database/entities/mercury/role_with_authorization.entity';
import { Authorization } from '@/libs/database/entities/mercury/authorization.entity';

@Injectable()
export class UserService {
  private sesClient: SesClient;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RoleWithUser)
    private readonly roleWithUserRepository: Repository<RoleWithUser>,
    @InjectRepository(RoleWithAuthorization)
    private readonly roleWithAuthorizationRepository: Repository<RoleWithAuthorization>,
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
    const systemAt = dayjs();
    const { 1: sentAt } =
      (await this.cacheService.getCaptchaValidation(to, token)) ?? [];

    if (!!sentAt && systemAt.diff(dayjs(sentAt), 'minutes') < 1) {
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
      systemAt.toDate(),
    ]);

    return systemAt.toDate();
  }

  /**
   * @author murukal
   * @description 查询单个用户
   */
  async user(
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
    { captcha, who }: VerifyInput,
    token: CacheToken = CacheToken.RegisterCaptcha,
  ) {
    const { 0: _sentCaptcha } =
      (await this.cacheService.getCaptchaValidation(who, token)) ?? [];

    if (_sentCaptcha !== captcha) {
      throw new Error('邮箱验证失败，请检查验证码');
    }

    return true;
  }

  /**
   * @author murukal
   * 1. 创建用户
   * 2. 默认分配游客角色
   *
   * 分配角色失败，保证用户数据回滚
   */
  async create(user: Partial<User>) {
    const { resolve, reject, promise } = Promise.withResolvers<User>();

    this.entityManager
      .transaction(async (entityManager) => {
        const _user = entityManager.create(User, user);
        await entityManager.save(_user);
        resolve(_user);
      })
      .catch((error) => reject(error));

    return promise;
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
        property: TENCENT_CLOUD_CONFIGURATION.secret_id,
      }),
      this.plutoClient.getConfiguration<string>({
        token: ConfigurationRegisterToken.TencentCloud,
        property: TENCENT_CLOUD_CONFIGURATION.secret_key,
      }),
      this.plutoClient.getConfiguration<string>({
        token: ConfigurationRegisterToken.TencentCloud,
        property: TENCENT_CLOUD_CONFIGURATION.ses_region,
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
   * @description 根据用户`id`批量查询用户信息
   */
  async getUsersByIds(ids: number[]) {
    return await this.userRepository.findBy({
      id: In(ids),
    });
  }

  /**
   * @author murukal
   * @description 更新用户信息
   */
  async updateUser(id: number, input: UpdateUserInput) {
    return !!(
      await this.userRepository.update(id, this.userRepository.create(input))
    ).affected;
  }

  /**
   * @author murukal
   * @description 修改密码
   */
  async changePassword(who: string, password: string) {
    const _user = await this.user(who);
    if (!_user) throw new UnauthorizedException('用户不存在');

    return !!(await this.userRepository.save(
      this.userRepository.create({
        id: _user.id,
        password,
      }),
    ));
  }

  /**
   * @author murukal
   * 分页查询用户列表
   */
  async paginateUsers({
    filter,
    pagination,
  }: {
    filter: FilterUserInput;
    pagination: Pagination;
  }) {
    const qb = this.userRepository.createQueryBuilder('user').where('1 = 1');

    if (filter?.keyword) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('user.username REGEXP :keyword')
            .orWhere('user.nickname REGEXP :keyword')
            .orWhere('user.emailAddress REGEXP :keyword');
        }),
      ).setParameter('keyword', filter.keyword);
    }

    return await qb
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();
  }

  /**
   * 获取指定用户对应的角色`Code`列表
   */
  async roleCodes(who: number) {
    return new Set(
      (
        await this.roleWithUserRepository
          .createQueryBuilder()
          .where({
            userId: who,
          })
          .getMany()
      ).map(({ roleCode }) => roleCode),
    );
  }

  /**
   * 获取当前用户对应的权限点
   * 1. 获取当前用户对应的角色
   * 2. 没有任何角色时，直接按空返回
   * 3. 根据角色获取角色关联的权限资源
   */
  async authorizations({ who }: { who: number }) {
    const roleCodes = await this.roleCodes(who);
    if (roleCodes.size === 0) {
      return [];
    }

    const qb = this.roleWithAuthorizationRepository
      .createQueryBuilder('roleWithAuthorization')
      .innerJoinAndSelect(
        'roleWithAuthorization.authorization',
        'authorization',
      )
      .select('authorization.resourceCode', 'resourceCode')
      .addSelect('authorization.actionCode', 'actionCode')
      .distinct(true)
      .where('roleWithAuthorization.roleCode IN (:...roleCodes)', {
        roleCodes: Array.from(roleCodes),
      });

    const authorizedPoints: Authorization[] = await qb.execute();
    return authorizedPoints;
  }
}
