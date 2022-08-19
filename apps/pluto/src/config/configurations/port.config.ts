// nest
import { registerAs } from '@nestjs/config';
// project
import { AppService } from 'assets/enums';

export default registerAs(
  'port',
  (): Record<AppService, number> => ({
    [AppService.Mercury]: 3002,
    [AppService.Earth]: 3004,
  }),
);
