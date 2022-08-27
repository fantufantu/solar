// nest
import { registerAs } from '@nestjs/config';
// project
import { ConfigJwtProperty, ConfigRegisterToken } from 'assets/enums';

export default registerAs<Record<ConfigJwtProperty, string>>(
  ConfigRegisterToken.Jwt,
  () => ({
    secret: '1',
  }),
);
