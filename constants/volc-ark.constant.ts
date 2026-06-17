import { ValueOf } from '@aiszlab/relax/types';

/**
 * 火山`ark`配置建
 */
export const VOLC_ARK_PROPERTY_TOKENS = {
  ARK_CABIN_CAB_API_KEY: 'ark-cabin-cab-api-key',
  ARK_CABIN_CAB_BASE_URL: 'ark-cabin-cab-base-url',
  ARK_CABIN_CAB_MODEL: 'ark-cabin-cab-model',
} as const;

/**
 * 火山`ark`配置键类型
 */
export type VolcArkPropertyToken = ValueOf<typeof VOLC_ARK_PROPERTY_TOKENS>;
