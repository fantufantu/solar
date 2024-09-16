import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcrypt';
import { constants, privateDecrypt, randomUUID } from 'crypto';
import { PlutoClientService } from '@/lib/pluto-client';
import { PassportService } from '@/lib/passport';
import { RegisterBy } from './dto/register-by.input';
import { paginateQuery } from 'utils/api';
import { Authorization } from '@/lib/database/entities/mercury/authorization.entity';
import { AuthorizationResource } from '@/lib/database/entities/mercury/authorization-resource.entity';
import { AuthorizationAction } from '@/lib/database/entities/mercury/authorization-action.entity';
import { AuthorizeBy } from './dto/authorize-by.input';
import { ConfigRegisterToken, RsaPropertyToken } from 'assets/tokens';
import { UserService } from '../user/user.service';
import { UserVerificationType } from '@/lib/database/entities/mercury/user-verification.entity';
import type { QueryBy } from 'typings/api';
import type { LoginBy } from './dto/login-by.input';
import type { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Authorization)
    private readonly authorizationRepository: Repository<Authorization>,
    @InjectRepository(AuthorizationResource)
    private readonly authorizationResourceRepository: Repository<AuthorizationResource>,
    @InjectRepository(AuthorizationAction)
    private readonly authorizationActionRepository: Repository<AuthorizationAction>,
    private readonly plutoClient: PlutoClientService,
    private readonly passportService: PassportService,
    private readonly userService: UserService,
  ) {}

  /**
   * 登录
   */
  async login(loginBy: LoginBy) {
    // 匹配用户信息
    const user = await this.getValidUser(loginBy);
    // 加密生成token
    return this.passportService.sign(user.id);
  }

  /**
   * 注册
   */
  async register(registerBy: RegisterBy) {
    // 邮箱验证
    await this.userService.verify({
      verifiedBy: registerBy.emailAddress,
      captcha: registerBy.captcha,
      type: UserVerificationType.Email,
    });
    // 用户注册
    const user = await this.signUp(registerBy);
    // 加密生成token
    return this.passportService.sign(user.id);
  }

  /**
   * 分页查询权限
   */
  getAuthorizations(queryBy?: QueryBy<Authorization>) {
    return paginateQuery(this.authorizationRepository, queryBy);
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
  async authorize(authorizeBy: AuthorizeBy) {
    const authorizeds = (
      await this.authorizationRepository.find({
        where: {
          tenantCode: authorizeBy.tenantCode,
        },
      })
    ).reduce((prev, current) => {
      return prev.set(
        [current.tenantCode, current.resourceCode, current.actionCode].join(),
        {
          ...current,
          deletedAt: new Date(),
        },
      );
    }, new Map<string, Authorization>());

    authorizeBy.authorizations.forEach((resource) => {
      resource.actionCodes.forEach((actionCode) => {
        const uniqueBy = [
          authorizeBy.tenantCode,
          resource.resourceCode,
          actionCode,
        ].join();
        const authorized = authorizeds.get(uniqueBy);

        // 未授权，授权
        if (!authorized) {
          authorizeds.set(
            uniqueBy,
            this.authorizationRepository.create({
              tenantCode: authorizeBy.tenantCode,
              resourceCode: resource.resourceCode,
              actionCode,
            }),
          );
          return;
        }

        authorized.deletedAt = null;
      });
    });

    return (
      (await this.authorizationRepository.save([...authorizeds.values()]))
        .length > 0
    );
  }

  /**
   * 验证用户名/密码
   */
  async getValidUser(loginBy: LoginBy) {
    // 根据关键字获取用户
    const user = await this.userService.getUser(loginBy.who, {
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) throw new UnauthorizedException('用户名或者密码错误！');

    // 校验密码
    const isPasswordValidate = compareSync(
      this.decryptByRsaPrivateKey(
        loginBy.password,
        await this.plutoClient.getConfig<string>({
          token: ConfigRegisterToken.Rsa,
          property: RsaPropertyToken.PrivateKey,
        }),
      ),
      user.password,
    );

    if (!isPasswordValidate)
      throw new UnauthorizedException('用户名或者密码错误！');

    return user;
  }

  /**
   * 用户创建
   */
  async signUp(registerBy: RegisterBy) {
    const { password, ...registerByWithout } = registerBy;
    // 注册密码解密
    const decryptedPassword = password
      ? this.decryptByRsaPrivateKey(
          password,
          await this.plutoClient.getConfig<string>({
            token: ConfigRegisterToken.Rsa,
            property: RsaPropertyToken.PrivateKey,
          }),
        )
      : randomUUID();

    return await this.userService.create({
      ...registerByWithout,
      password: decryptedPassword,
    });
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
}
