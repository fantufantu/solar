import { NestFactory } from '@nestjs/core';
import { ServicePort } from 'assets/ports';
import { AppModule } from './app.module';

async function bootstrap() {
  const application = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        /aisz\.dev$/,
        /fantufantu\.com$/,
        /knowthy\.net$/,
        /localhost:9527$/,
        /127.0.0.1:9527$/,
        /localhost:8200$/,
        /127.0.0.1:8200$/,
      ],
    },
  });

  await application.listen(ServicePort.Halley);

  console.info(
    `halley is running on http://localhost:${ServicePort.Halley}/graphql`,
  );
}
bootstrap();
