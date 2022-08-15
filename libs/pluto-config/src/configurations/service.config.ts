// nest
import { registerAs } from '@nestjs/config';

export default registerAs('service', () => ({
  name: 'PLUTO_SERVICE',
  port: 3001,
}));
