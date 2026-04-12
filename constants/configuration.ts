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
} as const;

export type RegisteredConfigurationToken = ValueOf<
  typeof REGISTERED_CONFIGURATION_TOKENS
>;
