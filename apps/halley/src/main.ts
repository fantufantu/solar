import { NestFactory } from '@nestjs/core';
import { ServicePort } from 'assets/ports';
import { ApplicationModule } from './application.module';

async function bootstrap() {
  const application = await NestFactory.create(ApplicationModule);
  await application.listen(ServicePort.Halley);

  application.enableCors({
    origin: [/aisz.dev/, /fantufantu.com/],
  });

  console.info(
    `halley is running on http://localhost:${ServicePort.Halley}/graphql`,
  );
}
bootstrap();
