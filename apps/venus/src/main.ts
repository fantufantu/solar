import { NestFactory } from '@nestjs/core';
import { ServicePort } from 'assets/ports';
import { ApplicationModule } from './application.module';

async function bootstrap() {
  const application = await NestFactory.create(ApplicationModule);
  await application.listen(ServicePort.Venus);

  console.info(
    `venus is running on http://localhost:${ServicePort.Venus}/graphql`,
  );
}

bootstrap();
