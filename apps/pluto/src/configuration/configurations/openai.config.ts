import type { Partialable } from '@aiszlab/relax/types';
import { registerAs } from '@nestjs/config';
import {
  OPENAI_PROPERTY_TOKEN,
  OpenaiPropertyToken,
  REGISTERED_CONFIGURATION_TOKENS,
} from 'constants/configuration';

export default registerAs<Record<OpenaiPropertyToken, Partialable<string>>>(
  REGISTERED_CONFIGURATION_TOKENS.OPENAI,
  () => ({
    [OPENAI_PROPERTY_TOKEN.ApiKey]: process.env.OPENAI_API_KEY,
    [OPENAI_PROPERTY_TOKEN.BaseUrl]: process.env.OPENAI_BASE_URL,
    [OPENAI_PROPERTY_TOKEN.Model]: process.env.OPENAI_MODEL,
  }),
);
