import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVICE_PORTS } from 'constants/ports.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(SERVICE_PORTS.EARTH);

  console.info(
    `earth is running on http://localhost:${SERVICE_PORTS.EARTH}/graphql`,
  );
}

bootstrap();
