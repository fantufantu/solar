import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ApplicationModule } from './application.module';
import { MicroservicePort, ServicePort } from 'assets/ports';

async function bootstrap() {
  const application = await NestFactory.create(ApplicationModule);

  // 创建微服务
  application.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: MicroservicePort.Mercury,
    },
  });

  await application.startAllMicroservices();
  await application.listen(ServicePort.Mercury);
  console.info(
    `mercury is running on http://localhost:${ServicePort.Mercury}/graphql`,
  );
}
bootstrap();
