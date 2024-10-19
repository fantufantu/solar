import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { constants, privateDecrypt, randomUUID } from 'crypto';
import { PlutoClientService } from '@/libs/pluto-client';
import { PassportService } from '@/libs/passport';
import { RegisterBy } from './dto/register-by.input';
import { ConfigurationRegisterToken, RsaPropertyToken } from 'assets/tokens';
import { UserService } from '../user/user.service';
import type { LoginBy } from './dto/login-by.input';
import { CacheService } from '@/libs/cache';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly plutoClient: PlutoClientService,
    private readonly passportService: PassportService,
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * @description
   * 登录
   */
  async login(loginBy: LoginBy) {
    // 匹配用户信息
    const user = await this.getValidUser(loginBy);
    // 加密生成token
    return [this.passportService.sign(user.id), user.id];
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
    return [this.passportService.sign(user.id), user.id];
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
   * 当前用户是否登录中
   * 使用缓存校验，如果用户强制登出后，会从缓存中移除
   */
  async isLoggedIn(userId: number) {
    return !!(await this.cacheService
      .getAuthenticated(userId)
      .catch(() => false));
  }

  /**
   * @description
   * 注销
   * 移除缓存，下次 `jwt.strategy` 鉴权，判断用户逐出，直接返回 401
   */
  async logout(userId: number) {
    return await this.cacheService
      .removeAuthenticated(userId)
      .then(() => true)
      .catch(() => false);
  }
}
