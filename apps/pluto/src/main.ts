import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { MICRO_SERVICE_PORTS } from 'constants/ports';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: MICRO_SERVICE_PORTS.PLUTO,
      },
    },
  );

  await app.listen();
  console.info('pluto is running');
}

bootstrap();
