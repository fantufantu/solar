import { NestFactory } from '@nestjs/core';
import { ServicePort } from 'assets/ports';
import { ApplicationModule } from './application.module';

async function bootstrap() {
  const application = await NestFactory.create(ApplicationModule, {
    cors: {
      origin: [/aisz\.dev$/, /fantufantu\.com$/, /localhost:9527$/],
    },
  });

  await application.listen(ServicePort.Halley);

  console.info(
    `halley is running on http://localhost:${ServicePort.Halley}/graphql`,
  );
}
bootstrap();
