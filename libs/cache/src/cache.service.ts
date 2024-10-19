import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CacheToken } from 'assets/tokens';
import type { Cache } from 'cache-manager';
import { toCacheKey } from 'utils/cache';
import type { CaptchaValidation } from './dto/captcha-validation';
import type { isLoggedIn } from './dto/authenticated';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * @description
   * 记录邮件验证码缓存
   * 有效期5分钟
   */
  setCaptchaValidation(to: string, value: CaptchaValidation) {
    return this.cacheManager.set(
      toCacheKey(CacheToken.Captcha, to),
      value,
      5 * 60 * 1000,
    );
  }

  /**
   * @description
   * 获取邮件验证码缓存
   */
  getCaptchaValidation(to: string) {
    return this.cacheManager.get<CaptchaValidation>(
      toCacheKey(CacheToken.Captcha, to),
    );
  }

  /**
   * @description
   * 记录当前用户是否登录
   * 有效期7天
   */
  setAuthenticated(userId: number) {
    return this.cacheManager.set(
      toCacheKey(CacheToken.Authenticated, userId),
      true,
      7 * 24 * 60 * 60 * 1000,
    );
  }

  /**
   * @description
   * 获取当前用户是否登录
   */
  getAuthenticated(userId: number) {
    return this.cacheManager.get<isLoggedIn>(
      toCacheKey(CacheToken.Authenticated, userId),
    );
  }

  /**
   * @description
   * 删除当前用户登录缓存
   */
  removeAuthenticated(userId: number) {
    return this.cacheManager.del(toCacheKey(CacheToken.Authenticated, userId));
  }
}
