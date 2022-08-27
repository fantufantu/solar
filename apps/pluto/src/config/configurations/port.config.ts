// nest
import { registerAs } from '@nestjs/config';
// project
import { AppServiceIdentity, ConfigRegisterToken } from 'assets/enums';

export default registerAs(
  ConfigRegisterToken.Port,
  (): Record<AppServiceIdentity, number> => ({
    [AppServiceIdentity.Mercury]: 3002,
    [AppServiceIdentity.Earth]: 3004,
  }),
);
