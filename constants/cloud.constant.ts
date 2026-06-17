import { ValueOf } from '@aiszlab/relax/types';

/**
 * 腾讯云配置项
 */
export const TENCENT_CLOUD_CONFIGURATION = {
  SECRET_ID: 'secretId',
  SECRET_KEY: 'secretKey',

  FANTU_BUCKET: 'fantu-bucket',
  FANTU_BUCKET_REGION: 'fantu-bucket-region',

  KNOWTHY_BUCKET: 'knowthy-bucket',
  KNOWTHY_BUCKET_REGION: 'knowthy-bucket-region',

  CABIN_CAB_BUCKET: 'cabin-cab-bucket',
  CABIN_CAB_BUCKET_REGION: 'cabin-cab-bucket-region',

  SES_REGION: 'ses-region',

  DATABASE_HOST: 'database-host',
  DATABASE_PORT: 'database-port',
  DATABASE_PASSWORD: 'database-password',
} as const;

export type TencentCloudConfiguration = ValueOf<
  typeof TENCENT_CLOUD_CONFIGURATION
>;
