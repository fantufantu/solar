import { registerAs } from '@nestjs/config';
import {
  AMAP_PROPERTY_TOKEN,
  AmapPropertyToken,
  REGISTERED_CONFIGURATION_TOKENS,
} from 'constants/configuration.constant';

export default registerAs<Record<AmapPropertyToken, string>>(
  REGISTERED_CONFIGURATION_TOKENS.AMAP,
  () => ({
    [AMAP_PROPERTY_TOKEN.API_KEY]: process.env.AMAP_API_KEY ?? '',
  }),
);
