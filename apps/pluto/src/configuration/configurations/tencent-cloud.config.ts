import { registerAs } from '@nestjs/config';
import {
  ConfigurationRegisterToken,
  TencentCloudPropertyToken,
} from 'assets/tokens';

export default registerAs<Record<TencentCloudPropertyToken, string>>(
  ConfigurationRegisterToken.TencentCloud,
  () => {
    return {
      [TencentCloudPropertyToken.SecretId]:
        process.env.TENCENT_CLOUD_SECRET_ID ?? '',
      [TencentCloudPropertyToken.SecretKey]:
        process.env.TENCENT_CLOUD_SECRET_KEY ?? '',

      [TencentCloudPropertyToken.Bucket]: process.env.BUCKET ?? '',
      [TencentCloudPropertyToken.BucketRegion]: process.env.BUCKET_REGION ?? '',

      [TencentCloudPropertyToken.SesRegion]: process.env.SES_REGION ?? '',
    };
  },
);
