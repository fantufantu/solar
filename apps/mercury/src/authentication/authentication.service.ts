import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { constants, privateDecrypt, randomUUID } from 'crypto';
import { PlutoClientService } from '@/lib/pluto-client';
import { PassportService } from '@/lib/passport';
import { RegisterBy } from './dto/register-by.input';
import {
  CacheToken,
  ConfigurationRegisterToken,
  RsaPropertyToken,
} from 'assets/tokens';
import { UserService } from '../user/user.service';
import type { LoginBy } from './dto/login-by.input';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { toCacheKey } from 'utils/cache';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly plutoClient: PlutoClientService,
    private readonly passportService: PassportService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * @description
   * 登录
   */
  async login(loginBy: LoginBy) {
    // 匹配用户信息
    const user = await this.getValidUser(loginBy);
    // 加密生成token
    return this.passportService.sign(user.id);
  }

  /**
   * @description
   * 注册
   */
  async register(registerBy: RegisterBy) {
    // 邮箱验证
    await this.userService.verify({
      verifiedBy: registerBy.emailAddress,
      captcha: registerBy.captcha,
    });
    // 用户注册
    const user = await this.signUp(registerBy);
    // 加密生成token
    return this.passportService.sign(user.id);
  }

  /**
   * @description
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
    const isPasswordValid = compareSync(
      this.decryptByRsaPrivateKey(
        loginBy.password,
        await this.plutoClient.getConfiguration<string>({
          token: ConfigurationRegisterToken.Rsa,
          property: RsaPropertyToken.PrivateKey,
        }),
      ),
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或者密码错误！');
    }

    return user;
  }

  /**
   * @description
   * 创建用户
   */
  async signUp(registerBy: RegisterBy) {
    const { password, ...registerByWithout } = registerBy;
    // 注册密码解密
    const decryptedPassword = password
      ? this.decryptByRsaPrivateKey(
          password,
          await this.plutoClient.getConfiguration<string>({
            token: ConfigurationRegisterToken.Rsa,
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
   * @description
   * 利用RSA公钥私钥解密前端传输过来的密文密码
   */
  decryptByRsaPrivateKey(encoding: string, privateKey: string): string {
    try {
      return privateDecrypt(
        { key: privateKey, padding: constants.RSA_PKCS1_PADDING },
        Buffer.from(encoding, 'base64'),
      ).toString();
    } catch (error) {
      return encoding;
    }
  }

  /**
   * @description
   * 判断当前认证凭证是否有效
   * 查询缓存中是否存在
   */
  async isAuthenticatedValid(authenticated: string) {
    return !!(await this.cacheManager
      .get<boolean>(toCacheKey(CacheToken.Authenticated, authenticated))
      .catch(() => false));
  }
}
