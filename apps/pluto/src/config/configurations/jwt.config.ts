// nest
import { registerAs } from '@nestjs/config';
// project
import { ConfigRegisterToken } from 'assets/enums';

export default registerAs(ConfigRegisterToken.Jwt, () => ({
  secret: '1',
}));
