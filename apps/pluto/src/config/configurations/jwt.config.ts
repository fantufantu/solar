import { registerAs } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { JwtPropertyToken, ConfigRegisterToken } from 'assets/tokens';

export default registerAs<Record<JwtPropertyToken, string>>(
  ConfigRegisterToken.Jwt,
  () => ({
    secret: process.env.JWT_SECRET || randomUUID(),
  }),
);
