// nest
import { registerAs } from '@nestjs/config';
// project
import { ConfigRegisterToken, TencentCloudPropertyToken } from 'assets/tokens';

export default registerAs<Record<TencentCloudPropertyToken, string>>(
  ConfigRegisterToken.TencentCloud,
  () => {
    console.log(
      'process.env.TENCENT_CLOUD_SECRET_ID====',
      process.env.TENCENT_CLOUD_SECRET_ID,
    );

    return {
      bucket: process.env.BUCKET,
      region: process.env.REGION,
      secretId: process.env.TENCENT_CLOUD_SECRET_ID,
      secretKey: process.env.TENCENT_CLOUD_SECRET_KEY,
    };
  },
);
