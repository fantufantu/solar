import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVICE_PORTS } from 'constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(SERVICE_PORTS.MARS);

  console.info(
    `mars is running on http://localhost:${SERVICE_PORTS.MARS}/graphql`,
  );
}
bootstrap();
