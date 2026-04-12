import { ValueOf } from '@aiszlab/relax/types';

/**
 * 火山`ark`配置建
 */
export const VOLC_ARK_PROPERTY_TOKENS = {
  CABIN_CAB_API_KEY: 'cabin-cab-api-key',
  CABIN_CAB_BASE_URL: 'cabin-cab-base-url',
  CABIN_CAB_MODEL: 'cabin-cab-model',
} as const;

/**
 * 火山`ark`配置键类型
 */
export type VolcArkPropertyToken = ValueOf<typeof VOLC_ARK_PROPERTY_TOKENS>;
