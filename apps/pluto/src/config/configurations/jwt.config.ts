// nest
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: '1',
}));
