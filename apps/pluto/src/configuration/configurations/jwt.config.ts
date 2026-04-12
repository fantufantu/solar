import { registerAs } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { JwtPropertyToken } from 'assets/tokens';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration';

export default registerAs<Record<JwtPropertyToken, string>>(
  REGISTERED_CONFIGURATION_TOKENS.JWT,
  () => {
    return {
      secret: process.env.JWT_SECRET || randomUUID(),
    };
  },
);
