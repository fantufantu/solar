import { NestFactory } from '@nestjs/core';
import { SERVICE_PORTS } from 'constants/ports.constant';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(SERVICE_PORTS.VENUS);

  console.info(
    `venus is running on http://localhost:${SERVICE_PORTS.VENUS}/graphql`,
  );
}

bootstrap();
