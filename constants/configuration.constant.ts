import type { ValueOf } from '@aiszlab/relax/types';

/**
 * 应用配置注册值
 */
export const REGISTERED_CONFIGURATION_TOKENS = {
  TENCENT_CLOUD: 'tencent-cloud',
  JWT: 'jwt',
  RSA: 'rsa',
  VOLC_ARK: 'volc-ark',
  AMAP: 'amap',
} as const;

export type RegisteredConfigurationToken = ValueOf<
  typeof REGISTERED_CONFIGURATION_TOKENS
>;

/**
 * 高德地图`API`配置项
 */
export const AMAP_PROPERTY_TOKEN = {
  API_KEY: 'api-key',
  API_SECRET: 'api-secret',
} as const;

export type AmapPropertyToken = ValueOf<typeof AMAP_PROPERTY_TOKEN>;
