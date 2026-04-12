import type { Partialable } from '@aiszlab/relax/types';
import { registerAs } from '@nestjs/config';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration';
import {
  VOLC_ARK_PROPERTY_TOKENS,
  VolcArkPropertyToken,
} from 'constants/volc-ark';

export default registerAs<Record<VolcArkPropertyToken, Partialable<string>>>(
  REGISTERED_CONFIGURATION_TOKENS.VOLC_ARK,
  () => ({
    [VOLC_ARK_PROPERTY_TOKENS.CABIN_CAB_API_KEY]: process.env.VOLC_ARK_API_KEY,
    [VOLC_ARK_PROPERTY_TOKENS.CABIN_CAB_BASE_URL]:
      process.env.VOLC_ARK_BASE_URL,
    [VOLC_ARK_PROPERTY_TOKENS.CABIN_CAB_MODEL]: process.env.VOLC_ARK_MODEL,
  }),
);
