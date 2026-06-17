import { registerAs } from '@nestjs/config';
import {
  TENCENT_CLOUD_CONFIGURATION,
  TencentCloudConfiguration,
} from 'constants/cloud.constant';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration.constant';

export default registerAs<Record<TencentCloudConfiguration, string>>(
  REGISTERED_CONFIGURATION_TOKENS.TENCENT_CLOUD,
  () => {
    return {
      [TENCENT_CLOUD_CONFIGURATION.SECRET_ID]:
        process.env.TENCENT_CLOUD_SECRET_ID ?? '',
      [TENCENT_CLOUD_CONFIGURATION.SECRET_KEY]:
        process.env.TENCENT_CLOUD_SECRET_KEY ?? '',

      [TENCENT_CLOUD_CONFIGURATION.FANTU_BUCKET]:
        process.env.FANTU_BUCKET ?? '',
      [TENCENT_CLOUD_CONFIGURATION.FANTU_BUCKET_REGION]:
        process.env.FANTU_BUCKET_REGION ?? '',

      [TENCENT_CLOUD_CONFIGURATION.KNOWTHY_BUCKET]:
        process.env.KNOWTHY_BUCKET ?? '',
      [TENCENT_CLOUD_CONFIGURATION.KNOWTHY_BUCKET_REGION]:
        process.env.KNOWTHY_BUCKET_REGION ?? '',

      [TENCENT_CLOUD_CONFIGURATION.CABIN_CAB_BUCKET]:
        process.env.CABIN_CAB_BUCKET ?? '',
      [TENCENT_CLOUD_CONFIGURATION.CABIN_CAB_BUCKET_REGION]:
        process.env.CABIN_CAB_BUCKET_REGION ?? '',

      [TENCENT_CLOUD_CONFIGURATION.SES_REGION]: process.env.SES_REGION ?? '',

      [TENCENT_CLOUD_CONFIGURATION.DATABASE_HOST]:
        process.env.DATABASE_HOST ?? '',
      [TENCENT_CLOUD_CONFIGURATION.DATABASE_PORT]:
        process.env.DATABASE_PORT ?? '3306',
      [TENCENT_CLOUD_CONFIGURATION.DATABASE_PASSWORD]:
        process.env.DATABASE_PASSWORD ?? '',
    };
  },
);
