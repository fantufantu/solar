import { registerAs } from '@nestjs/config';
import { ConfigRegisterToken, TencentCloudPropertyToken } from 'assets/tokens';

export default registerAs<Record<TencentCloudPropertyToken, string>>(
  ConfigRegisterToken.TencentCloud,
  () => {
    return {
      bucket: process.env.BUCKET || '',
      region: process.env.REGION || '',
      secretId: process.env.TENCENT_CLOUD_SECRET_ID || '',
      secretKey: process.env.TENCENT_CLOUD_SECRET_KEY || '',
    };
  },
);
