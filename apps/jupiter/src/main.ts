import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVICE_PORTS } from 'constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [/localhost:9527$/],
    },
  });

  await app.listen(SERVICE_PORTS.JUPITER);

  console.info(
    `jupiter graphql is running on http://localhost:${SERVICE_PORTS.JUPITER}/graphql`,
  );
  console.info(
    `jupiter api is running on http://localhost:${SERVICE_PORTS.JUPITER}/`,
  );
}
bootstrap();
