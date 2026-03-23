import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { MICRO_SERVICE_PORTS, SERVICE_PORTS } from 'constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: (_, callback) => {
        callback(null, true);
      },
    },
  });

  // 创建微服务
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: MICRO_SERVICE_PORTS.MERCURY,
    },
  });

  await app.startAllMicroservices();
  await app.listen(SERVICE_PORTS.MERCURY);
  console.info(
    `mercury is running on http://localhost:${SERVICE_PORTS.MERCURY}/graphql`,
  );
}

bootstrap();
