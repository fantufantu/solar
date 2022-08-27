// nest
import { registerAs } from '@nestjs/config';
// project
import { AppServiceIdentity, ConfigRegisterToken } from 'assets/enums';

export default registerAs<Record<AppServiceIdentity, number>>(
  ConfigRegisterToken.Port,
  () => ({
    [AppServiceIdentity.Mercury]: 3002,
    [AppServiceIdentity.Earth]: 3004,
  }),
);
