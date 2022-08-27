// nest
import { registerAs } from '@nestjs/config';
// project
import { ConfigRegisterToken } from 'assets/enums';

export default registerAs(ConfigRegisterToken.Service, () => ({
  port: 3001,
}));
