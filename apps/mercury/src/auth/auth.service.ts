// nest
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import dayjs = require('dayjs');
import { compareSync } from 'bcrypt';
import { constants, privateDecrypt } from 'crypto';
import { ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface';
import { Client as SesClient } from 'tencentcloud-sdk-nodejs/tencentcloud/services/ses/v20201002/ses_client';
// project
import { PlutoClientService } from '@app/pluto-client';
import { PassportService } from '@app/passport';
import { User } from './entities/user.entity';
import { RegisterInput } from './dtos/register.input';
import { UserEmail } from './entities/user-email.entity';
import { paginateQuery } from 'utils/api';
import { Authorization } from './entities/authorization.entity';
import { TenantService } from '../tenant/tenant.service';
import { AuthorizationResource } from './entities/authorization-resource.entity';
import { AuthorizationAction } from './entities/authorization-action.entity';
import { AuthorizationsArgs } from './dtos/authorizations.args';
import { SendCaptchaArgs } from './dtos/send-captcha.args';
import {
  ConfigRegisterToken,
  JwtPropertyToken,
  RsaPropertyToken,
  TencentCloudPropertyToken,
} from 'assets/tokens';
import type { QueryParams } from 'typings/api';
import type { LoginInput } from './dtos/login.input';
import type { FindOneOptions, Repository } from 'typeorm';
import type { AuthorizationNode } from './dtos/authorization-node';

@Injectable()
export class AuthService {
  private sesClient: SesClient;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserEmail)
    private readonly userEmailRepository: Repository<UserEmail>,
    @InjectRepository(Authorization)
    private readonly authorizationRepository: Repository<Authorization>,
    @InjectRepository(AuthorizationResource)
    private readonly authorizationResourceRepository: Repository<AuthorizationResource>,
    @InjectRepository(AuthorizationAction)
    private readonly authorizationActionRepository: Repository<AuthorizationAction>,
    private readonly plutoClient: PlutoClientService,
    private readonly passportService: PassportService,
    private readonly tenantService: TenantService,
  ) {
    this.initializeSesClient();
  }

  /**
   * 登录
   */
  async login(login: LoginInput): Promise<string> {
    // 匹配用户信息
    const user = await this.getValidatedUser(login);
    // error: 用户信息不存在
    if (!user) throw new UnauthorizedException();
    // 加密生成token
    return this.passportService.sign(user.id);
  }

  /**
   * 注册
   */
  async register(registerInput: RegisterInput): Promise<string> {
    // 验证邮箱有效性
    const isVerified = await this.verifyUserEmail({
      emailAddress: registerInput.emailAddress,
      captcha: registerInput.captcha,
    });
    if (!isVerified) throw new Error('邮箱验证失败，请检查验证码');
    // 用户注册
    const user = await this.createUser(registerInput);
    // 加密生成token
    return this.passportService.sign(user.id);
  }

  /**
   * 分页查询权限
   */
  getAuthorizations(query?: QueryParams) {
    return paginateQuery(this.authorizationRepository, query);
  }

  /**
   * 查询权限树
   */
  async getAuthorizationTree() {
    // 查询租户列表
    const tenants = (await this.tenantService.getTenants()).items;

    // 权限表查询
    const authorizations = await this.authorizationRepository.find({
      relations: ['tenant', 'resource', 'action'],
      where: {
        isDeleted: false,
      },
    });

    // 生成树
    return authorizations.reduce<AuthorizationNode[]>(
      (previous, authorization) => {
        const actionNode = {
          key: authorization.id,
          title: authorization.action.name,
          code: authorization.action.code,
        };

        // 查询租户
        const tenantNode = previous.find(
          (tenant) => tenant.code === authorization.tenant.code,
        );

        // 租户不存在，不生成权限
        if (!tenantNode) return previous;

        // 查询资源
        const resourceNode = tenantNode.children.find(
          (resource) => resource.code === authorization.resource.code,
        );

        if (!resourceNode) {
          // 不存在：生成资源节点 and 添加操作节点
          tenantNode.children.push({
            // 生成唯一key
            key: `${authorization.tenant.code}:${authorization.resource.code}`,
            title: authorization.resource.name,
            code: authorization.resource.code,
            children: [actionNode],
          });
        } else {
          // 存在：添加操作节点
          resourceNode.children.push(actionNode);
        }

        return previous;
      },

      // 初始化树
      tenants.map((tenant) => ({
        key: tenant.code,
        title: tenant.name,
        code: tenant.code,
        children: [],
      })),
    );
  }

  /**
   * 查询权限资源
   */
  getAuthorizationResources() {
    return this.authorizationResourceRepository.find();
  }

  /**
   * 查询权限操作
   */
  getAuthorizationActions() {
    return this.authorizationActionRepository.find();
  }

  /**
   * 分配权限
   */
  async setAuthorizations(args: AuthorizationsArgs) {
    const authorizeds = await this.authorizationRepository.find({
      where: {
        tenantCode: args.tenantCode,
      },
    });

    // 设置为删除
    authorizeds.forEach((authorized) => (authorized.isDeleted = true));

    args.authorizations.forEach((resource) => {
      return resource.actionCodes.forEach((actionCode) => {
        const authorized = authorizeds.find(
          (authorized) =>
            authorized.actionCode === actionCode &&
            authorized.tenantCode === args.tenantCode &&
            authorized.resourceCode === resource.resourceCode,
        );

        // 已存在，更新
        if (authorized) {
          authorized.isDeleted = false;
          return;
        }

        // 未存在，创建
        authorizeds.push(
          this.authorizationRepository.create({
            tenantCode: args.tenantCode,
            resourceCode: resource.resourceCode,
            actionCode,
          }),
        );
      });
    });

    return !!(await this.authorizationRepository.save(authorizeds)).length;
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
   * 验证用户名/密码
   */
  async getValidatedUser(payload: LoginInput) {
    // 根据关键字获取用户
    const user = await this.getUser(payload.keyword, {
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) throw new UnauthorizedException('用户名或者密码错误！');

    // 校验密码
    const isPasswordValidate = compareSync(
      this.decryptByRsaPrivateKey(
        payload.password,
        await this.plutoClient.getConfig<string>({
          token: ConfigRegisterToken.Jwt,
          property: JwtPropertyToken.Secret,
        }),
      ),
      user.password,
    );

    if (!isPasswordValidate)
      throw new UnauthorizedException('用户名或者密码错误！');

    return user;
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
   * 利用RSA公钥私钥解密前端传输过来的密文密码
   */
  decryptByRsaPrivateKey(encoding: string, privateKey: string): string {
    try {
      return privateDecrypt(
        { key: privateKey, padding: constants.RSA_PKCS1_PADDING },
        Buffer.from(encoding, 'base64'),
      ).toString();
    } catch (e) {
      return encoding;
    }
  }

  /**
   * 验证用户邮箱
   */
  async verifyUserEmail(verifyInput: {
    emailAddress: string;
    captcha: string;
  }) {
    return !!(
      await this.userEmailRepository
        .createQueryBuilder()
        .update()
        .set({
          isVerified: true,
        })
        .where('address = :address', {
          address: verifyInput.emailAddress,
        })
        .andWhere('captcha = :captcha', {
          captcha: verifyInput.captcha,
        })
        .execute()
    ).affected;
  }

  /**
   * 创建用户
   */
  async createUser(registerInput: RegisterInput) {
    const { password, ...register } = registerInput;

    // 注册密码解密
    const decryptedPassword = this.decryptByRsaPrivateKey(
      password,
      await this.plutoClient.getConfig<string>({
        token: ConfigRegisterToken.Rsa,
        property: RsaPropertyToken.PrivateKey,
      }),
    );

    return this.userRepository.save(
      this.userRepository.create({
        ...register,
        password: decryptedPassword,
      }),
    );
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
   * 初始化 ses client (发送邮件)
   */
  private async initializeSesClient() {
    console.log('11111');

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

    console.log('this.sesClient====', this.sesClient);
  }
}
