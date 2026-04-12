import type { Partialable } from '@aiszlab/relax/types';
import { registerAs } from '@nestjs/config';
import { OpenaiPropertyToken } from 'assets/tokens';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration';

export default registerAs<Record<OpenaiPropertyToken, Partialable<string>>>(
  REGISTERED_CONFIGURATION_TOKENS.OPENAI,
  () => ({
    [OpenaiPropertyToken.ApiKey]: process.env.OPENAI_API_KEY,
    [OpenaiPropertyToken.BaseUrl]: process.env.OPENAI_BASE_URL,
    [OpenaiPropertyToken.Model]: process.env.OPENAI_MODEL,
  }),
);
