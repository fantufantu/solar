import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { constants, privateDecrypt, randomUUID } from 'crypto';
import { PlutoClientService } from '@/libs/pluto-client';
import { PassportService } from '@/libs/passport';
import { RegisterInput } from './dto/register.input';
import { RSA_PROPERTY_TOKEN } from 'constants/common.constant';
import { CACHE_TOKEN } from 'constants/cache.constant';
import { UserService } from '../user/user.service';
import { LoginInput } from './dto/login.input';
import { CacheService } from '@/libs/cache';
import { ChangePasswordInput } from './dto/change-password.input';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration.constant';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly plutoClient: PlutoClientService,
    private readonly passportService: PassportService,
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * 登录
   */
  async login(input: LoginInput) {
    // 匹配用户信息
    const user = await this.getValidUser(input);
    // 加密生成token
    return [this.passportService.sign(user.id), user.id];
  }

  /**
   * 用户注册
   */
  async register(input: RegisterInput) {
    // 邮箱验证
    await this.userService.verify({
      who: input.emailAddress,
      captcha: input.captcha,
    });
    // 用户注册
    const user = await this.signUp(input);
    // 加密生成token
    return [this.passportService.sign(user.id), user.id];
  }

  /**
   * 验证用户名/密码
   */
  async getValidUser(input: LoginInput) {
    // 根据关键字获取用户
    const user = await this.userService.who({
      where: [
        {
          username: input.who,
        },
        {
          emailAddress: input.who,
        },
      ],
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) throw new UnauthorizedException('用户名或者密码错误！');

    // 校验密码
    const isPasswordValid = compareSync(input.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或者密码错误！');
    }

    return user;
  }

  /**
   * 注册
   */
  async signUp({ password, ..._registerInput }: RegisterInput) {
    // 注册密码解密
    const decryptedPassword = password
      ? this.decryptByRsaPrivateKey(
          password,
          await this.plutoClient.getConfiguration<string>({
            token: REGISTERED_CONFIGURATION_TOKENS.RSA,
            property: RSA_PROPERTY_TOKEN.PRIVATE_KEY,
          }),
        )
      : randomUUID();

    return await this.userService.create({
      ..._registerInput,
      password: decryptedPassword,
    });
  }

  /**
   * 利用RSA公钥私钥解密前端传输过来的密文密码
   * 如果传入的不是加密过的密文（明文密码），则直接返回原文
   */
  private decryptByRsaPrivateKey(encoding: string, privateKey: string): string {
    // 预检查：判断是否为 RSA 加密过的密文
    // RSA 加密输出长度等于密钥长度（2048位→256字节，base64编码后约344字符）
    // 明文密码 base64 解码后远小于 256 字节，据此区分
    if (!this.isEncryptedByRsa(encoding)) {
      return encoding;
    }

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
   * 判断字符串是否为 RSA 加密后的 base64 密文
   * 检查依据：有效的 base64 格式 + 解码后长度匹配 RSA 密钥长度
   */
  private isEncryptedByRsa(input: string): boolean {
    // 必须是有效的 base64 格式
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(input)) {
      return false;
    }

    // 解码后长度应 >= 256 字节（RSA 2048位密钥的最小输出）
    // 明文密码（即便 base64 合法）解码后通常只有几十字节
    const decodedLength = Buffer.from(input, 'base64').length;
    return decodedLength >= 256;
  }

  /**
   * 当前用户是否登录中
   * 使用缓存校验，如果用户强制登出后，会从缓存中移除
   */
  async isLoggedIn(userId: string) {
    return !!(await this.cacheService
      .getAuthenticated(userId)
      .catch(() => false));
  }

  /**
   * 修改密码
   */
  async changePassword({ captcha, password, who }: ChangePasswordInput) {
    // 邮箱验证
    const isValid = await this.userService.verify(
      {
        who,
        captcha,
      },
      CACHE_TOKEN.CHANGE_PASSWORD_CAPTCHA,
    );
    if (!isValid) throw new UnauthorizedException('验证码错误');

    // 修改为解密后的密码
    const decryptedPassword = this.decryptByRsaPrivateKey(
      password,
      await this.plutoClient.getConfiguration<string>({
        token: REGISTERED_CONFIGURATION_TOKENS.RSA,
        property: RSA_PROPERTY_TOKEN.PRIVATE_KEY,
      }),
    );

    return this.userService.changePassword(who, decryptedPassword);
  }

  /**
   * 注销
   * 移除缓存，下次 `jwt.strategy` 鉴权，判断用户逐出，直接返回 401
   */
  async logout(userId: string) {
    return await this.cacheService
      .removeAuthenticated(userId)
      .then(() => true)
      .catch(() => false);
  }
}
