import { registerAs } from '@nestjs/config';
import { randomUUID } from 'crypto';
import type { JwtPropertyToken } from 'constants/common.constant';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration.constant';

export default registerAs<Record<JwtPropertyToken, string>>(
  REGISTERED_CONFIGURATION_TOKENS.JWT,
  () => {
    return {
      secret: process.env.JWT_SECRET || randomUUID(),
    };
  },
);
