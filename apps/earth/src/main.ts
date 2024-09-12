import { NestFactory } from '@nestjs/core';
import { EarthModule } from './earth.module';

async function bootstrap() {
  const app = await NestFactory.create(EarthModule);
  await app.listen(3000);
}
bootstrap();
