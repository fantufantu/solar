import type { ValueOf } from '@aiszlab/relax/types';

/**
 * 应用服务常量
 */
export const APPLICATION_TOKEN = {
  MERCURY: 'mercury',
  VENUS: 'venus',
  EARTH: 'earth',
  MARS: 'mars',
  JUPITER: 'jupiter',
} as const;

export type ApplicationToken = ValueOf<typeof APPLICATION_TOKEN>;

/**
 * 自定义的 provider token
 */
export const PROVIDER_TOKEN = {
  PLUTO_CLIENT_PROXY: 'PlutoClientProxy',
  MERCURY_CLIENT_PROXY: 'MercuryClientProxy',
  JWT_SECRET: 'JwtSecret',
} as const;

export type ProviderToken = ValueOf<typeof PROVIDER_TOKEN>;
