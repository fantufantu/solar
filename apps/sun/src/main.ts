import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './application.module';

async function bootstrap() {
  const application = await NestFactory.create(ApplicationModule);
  await application.listen(3000);
}

bootstrap();
