import { registerAs } from '@nestjs/config';
import {
  TENCENT_CLOUD_CONFIGURATION,
  TencentCloudConfiguration,
} from 'constants/cloud';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration';

export default registerAs<Record<TencentCloudConfiguration, string>>(
  REGISTERED_CONFIGURATION_TOKENS.TENCENT_CLOUD,
  () => {
    return {
      [TENCENT_CLOUD_CONFIGURATION.secret_id]:
        process.env.TENCENT_CLOUD_SECRET_ID ?? '',
      [TENCENT_CLOUD_CONFIGURATION.secret_key]:
        process.env.TENCENT_CLOUD_SECRET_KEY ?? '',

      [TENCENT_CLOUD_CONFIGURATION.fantu_bucket]:
        process.env.FANTU_BUCKET ?? '',
      [TENCENT_CLOUD_CONFIGURATION.fantu_bucket_region]:
        process.env.FANTU_BUCKET_REGION ?? '',

      [TENCENT_CLOUD_CONFIGURATION.knowthy_bucket]:
        process.env.KNOWTHY_BUCKET ?? '',
      [TENCENT_CLOUD_CONFIGURATION.knowthy_bucket_region]:
        process.env.KNOWTHY_BUCKET_REGION ?? '',

      [TENCENT_CLOUD_CONFIGURATION.ses_region]: process.env.SES_REGION ?? '',

      [TENCENT_CLOUD_CONFIGURATION.database_host]:
        process.env.DATABASE_HOST ?? '',
      [TENCENT_CLOUD_CONFIGURATION.database_port]:
        process.env.DATABASE_PORT ?? '3306',
      [TENCENT_CLOUD_CONFIGURATION.database_password]:
        process.env.DATABASE_PASSWORD ?? '',
    };
  },
);
