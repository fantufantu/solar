import { CacheToken } from 'assets/tokens';

/**
 * @description
 * 快速生成符合格式的 cache key
 */
export function toCacheKey(token: CacheToken, value: string | number) {
  if (!token) return value.toString();
  return [token, value.toString()].join('/');
}
