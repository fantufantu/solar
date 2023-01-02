// nest
import { registerAs } from '@nestjs/config';
// project
import { JwtPropertyToken, ConfigRegisterToken } from 'assets/tokens';

export default registerAs<Record<JwtPropertyToken, string>>(
  ConfigRegisterToken.Jwt,
  () => ({
    secret: '1',
  }),
);
