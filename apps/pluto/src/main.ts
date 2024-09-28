import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ApplicationModule } from './application.module';
import { MicroservicePort } from 'assets/ports';

async function bootstrap() {
  const application = await NestFactory.createMicroservice<MicroserviceOptions>(
    ApplicationModule,
    {
      transport: Transport.TCP,
      options: {
        port: MicroservicePort.Pluto,
      },
    },
  );

  await application.listen();
  console.info('pluto is running');
}

bootstrap();
