import { NestFactory } from '@nestjs/core';
import { SERVICE_PORTS } from 'constants/ports';
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

  await application.listen(SERVICE_PORTS.HALLEY);

  console.info(
    `halley is running on http://localhost:${SERVICE_PORTS.HALLEY}/graphql`,
  );
}
bootstrap();
