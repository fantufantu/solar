// nest
import { NestFactory } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
// project
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const pluto = app.get('PLUTO_SERVICE');

  const jwtSecret = await pluto.send({ cmd: 'config.get' }, 'jwt.secret');

  console.log(jwtSecret);

  await app.listen(3000);
}
bootstrap();
