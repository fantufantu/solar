import { registerAs } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { JwtPropertyToken, ConfigurationRegisterToken } from 'assets/tokens';

export default registerAs<Record<JwtPropertyToken, string>>(
  ConfigurationRegisterToken.Jwt,
  () => ({
    secret: process.env.JWT_SECRET || randomUUID(),
  }),
);
