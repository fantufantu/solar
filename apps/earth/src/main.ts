import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServicePort } from 'assets/ports';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ServicePort.Earth);
  console.info(
    `earth is running on http://localhost:${ServicePort.Earth}/graphql`,
  );
}

bootstrap();
