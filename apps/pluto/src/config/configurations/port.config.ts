// nest
import { registerAs } from '@nestjs/config';
// project
import { AppServiceIdentity } from 'assets/enums';

export default registerAs(
  'port',
  (): Record<AppServiceIdentity, number> => ({
    [AppServiceIdentity.Mercury]: 3002,
    [AppServiceIdentity.Earth]: 3004,
  }),
);
