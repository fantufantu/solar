// nest
import { registerAs } from '@nestjs/config';
// third
import { v4 } from 'uuid';
// project
import { JwtPropertyToken, ConfigRegisterToken } from 'assets/tokens';

export default registerAs<Record<JwtPropertyToken, string>>(
  ConfigRegisterToken.Jwt,
  () => ({
    secret: v4(),
  }),
);
