// nest
import { registerAs } from '@nestjs/config';
// third
import { randomUUID } from 'crypto';
// project
import { JwtPropertyToken, ConfigRegisterToken } from 'assets/tokens';

export default registerAs<Record<JwtPropertyToken, string>>(
  ConfigRegisterToken.Jwt,
  () => ({
    secret: randomUUID(),
  }),
);
