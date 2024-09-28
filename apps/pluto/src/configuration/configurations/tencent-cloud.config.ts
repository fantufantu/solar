import { registerAs } from '@nestjs/config';
import {
  ConfigurationRegisterToken,
  TencentCloudPropertyToken,
} from 'assets/tokens';

export default registerAs<Record<TencentCloudPropertyToken, string>>(
  ConfigurationRegisterToken.TencentCloud,
  () => {
    return {
      bucket: process.env.BUCKET ?? '',
      region: process.env.REGION ?? '',
      secretId: process.env.TENCENT_CLOUD_SECRET_ID ?? '',
      secretKey: process.env.TENCENT_CLOUD_SECRET_KEY ?? '',
    };
  },
);
