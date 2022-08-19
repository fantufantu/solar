// nest
import { registerAs } from '@nestjs/config';

export default registerAs('service', () => ({
  port: 3001,
}));
