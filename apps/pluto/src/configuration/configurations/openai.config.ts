import type { Partialable } from '@aiszlab/relax/types';
import { registerAs } from '@nestjs/config';
import { OpenaiPropertyToken, ConfigurationRegisterToken } from 'assets/tokens';

export default registerAs<Record<OpenaiPropertyToken, Partialable<string>>>(
  ConfigurationRegisterToken.Openai,
  () => ({
    [OpenaiPropertyToken.ApiKey]: process.env.OPENAI_API_KEY,
    [OpenaiPropertyToken.BaseUrl]: process.env.OPENAI_BASE_URL,
  }),
);
