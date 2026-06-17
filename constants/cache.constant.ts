import type { ValueOf } from '@aiszlab/relax/types';

/**
 * @description
 * cache token
 * 主要用于前缀，在 solar 中，cache key 主要依赖 prefix/value
 */
export const CACHE_TOKEN = {
  // 认证令牌
  AUTHENTICATED: 'authenticated',
  // 注册验证码
  REGISTER_CAPTCHA: 'register-captcha',
  // 修改密码验证码
  CHANGE_PASSWORD_CAPTCHA: 'change-password-captcha',
  // None
  NONE: '',
} as const;

export type CacheToken = ValueOf<typeof CACHE_TOKEN>;
