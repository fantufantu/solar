// nest
import { registerAs } from '@nestjs/config';
// project
import { ConfigRegisterToken, ConfigTencentCloudProperty } from 'assets/enums';

export default registerAs<Record<ConfigTencentCloudProperty, string>>(
  ConfigRegisterToken.TencentCloud,
  () => ({
    bucket: process.env.BUCKET,
    region: process.env.REGION,
    secretId: process.env.TENCENT_CLOUD_SECRET_ID,
    secretKey: process.env.TENCENT_CLOUD_SECRET_KEY,
  }),
);
