import { ValueOf } from '@aiszlab/relax/types';

/**
 * 应用配置注册值
 */
export const REGISTERED_CONFIGURATION_TOKENS = {
  TENCENT_CLOUD: 'tencent-cloud',
  JWT: 'jwt',
  RSA: 'rsa',
  OPENAI: 'openai',
  VOLC_ARK: 'volc-ark',
  AMAP: 'amap',
} as const;

export type RegisteredConfigurationToken = ValueOf<
  typeof REGISTERED_CONFIGURATION_TOKENS
>;

/**
 * openai 配置项
 */
export const OPENAI_PROPERTY_TOKEN = {
  API_KEY: 'api-key',
  BASE_URL: 'base-url',
  MODEL: 'model',
} as const;

export type OpenaiPropertyToken = ValueOf<typeof OPENAI_PROPERTY_TOKEN>;

/**
 * 高德地图 配置项
 */
export const AMAP_PROPERTY_TOKEN = {
  API_KEY: 'api-key',
} as const;

export type AmapPropertyToken = ValueOf<typeof AMAP_PROPERTY_TOKEN>;
