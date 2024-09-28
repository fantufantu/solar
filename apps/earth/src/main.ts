import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './application.module';
import { ServicePort } from 'assets/ports';

async function bootstrap() {
  const application = await NestFactory.create(ApplicationModule);
  await application.listen(ServicePort.Earth);
  console.info(
    `earth is running on http://localhost:${ServicePort.Earth}/graphql`,
  );
}

bootstrap();
