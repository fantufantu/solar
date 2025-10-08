import { ValueOf } from '@aiszlab/relax/types';

/**
 * 腾讯云配置项
 */
export const TENCENT_CLOUD_CONFIGURATION = {
  secret_id: 'secretId',
  secret_key: 'secretKey',

  fantu_bucket: 'fantu-bucket',
  fantu_bucket_region: 'fantu-bucket-region',

  knowthy_bucket: 'knowthy-bucket',
  knowthy_bucket_region: 'knowthy-bucket-region',

  ses_region: 'ses-region',

  database_host: 'database-host',
  database_port: 'database-port',
  database_password: 'database-password',
} as const;

export type TencentCloudConfiguration = ValueOf<
  typeof TENCENT_CLOUD_CONFIGURATION
>;
