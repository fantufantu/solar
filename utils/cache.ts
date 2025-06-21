import { CacheToken } from 'assets/tokens';

/**
 * @description
 * 快速生成符合格式的 cache key
 */
export function toCacheKey(token: CacheToken, value: string | number) {
  return [token, value.toString()].join('/');
}
