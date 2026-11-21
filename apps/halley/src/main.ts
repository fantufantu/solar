import { NestFactory } from '@nestjs/core';
import { SERVICE_PORTS } from 'constants/ports.constant';
import { AppModule } from './app.module';

async function bootstrap() {
  const application = await NestFactory.create(AppModule, {
    cors: {
      origin: (origin, callback) => {
        callback(null, origin);
      },
    },
  });

  await application.listen(SERVICE_PORTS.HALLEY);

  console.info(
    `halley is running on http://localhost:${SERVICE_PORTS.HALLEY}/graphql`,
  );
}
bootstrap();
