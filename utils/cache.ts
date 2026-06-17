import type { CacheToken } from 'constants/cache.constant';
import { SYSTEM_WILDCARD } from 'constants/common.constant';

/**
 * @description
 * 快速生成符合格式的 cache key
 */
export function toCacheKey(token: CacheToken, value: string | number) {
  return [token, value.toString()].join(SYSTEM_WILDCARD.SEPARATOR);
}
