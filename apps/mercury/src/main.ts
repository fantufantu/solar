import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { MicroservicePort, ServicePort } from 'assets/ports';

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
      port: MicroservicePort.Mercury,
    },
  });

  await app.startAllMicroservices();
  await app.listen(ServicePort.Mercury);
  console.info(
    `mercury is running on http://localhost:${ServicePort.Mercury}/graphql`,
  );
}
bootstrap();
