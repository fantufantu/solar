import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { MicroservicePort } from 'assets/ports';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: MicroservicePort.Pluto,
      },
    },
  );

  await app.listen();
  console.info('pluto is running');
}

bootstrap();
