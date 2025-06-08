import { NestFactory } from '@nestjs/core';
import { ServicePort } from 'assets/ports';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ServicePort.Venus);

  console.info(
    `venus is running on http://localhost:${ServicePort.Venus}/graphql`,
  );
}

bootstrap();
