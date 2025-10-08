import { registerAs } from '@nestjs/config';
import { ConfigurationRegisterToken } from 'assets/tokens';
import {
  TENCENT_CLOUD_CONFIGURATION,
  TencentCloudConfiguration,
} from 'constants/cloud';

export default registerAs<Record<TencentCloudConfiguration, string>>(
  ConfigurationRegisterToken.TencentCloud,
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
