import { registerAs } from '@nestjs/config';
import {
  ConfigurationRegisterToken,
  TencentCloudPropertyToken,
} from 'assets/tokens';
import { ValueOf } from '@aiszlab/relax/types';

export default registerAs<
  Record<ValueOf<typeof TencentCloudPropertyToken>, string>
>(ConfigurationRegisterToken.TencentCloud, () => {
  return {
    [TencentCloudPropertyToken.SecretId]:
      process.env.TENCENT_CLOUD_SECRET_ID ?? '',
    [TencentCloudPropertyToken.SecretKey]:
      process.env.TENCENT_CLOUD_SECRET_KEY ?? '',

    [TencentCloudPropertyToken.FantuBucket]: process.env.FANTU_BUCKET ?? '',
    [TencentCloudPropertyToken.FantuBucketRegion]:
      process.env.FANTU_BUCKET_REGION ?? '',

    [TencentCloudPropertyToken.KnowthyBucket]: process.env.KNOWTHY_BUCKET ?? '',
    [TencentCloudPropertyToken.KnowthyBucketRegion]:
      process.env.KNOWTHY_BUCKET_REGION ?? '',

    [TencentCloudPropertyToken.SesRegion]: process.env.SES_REGION ?? '',

    [TencentCloudPropertyToken.DatabaseHost]: process.env.DATABASE_HOST ?? '',
    [TencentCloudPropertyToken.DatabasePort]:
      process.env.DATABASE_PORT ?? '3306',
    [TencentCloudPropertyToken.DatabasePassword]:
      process.env.DATABASE_PASSWORD ?? '',
  };
});
