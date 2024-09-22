import { NestFactory } from '@nestjs/core';
import { ServicePort } from 'assets/ports';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ServicePort.Halley);

  console.info(
    `halley is running on http://localhost:${ServicePort.Halley}/graphql`,
  );
}
bootstrap();
