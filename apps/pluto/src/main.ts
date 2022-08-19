// nest
import { NestFactory } from '@nestjs/core';
import type { MicroserviceOptions } from '@nestjs/microservices';
// project
import { AppModule } from './app.module';
import { PlutoConfigService } from '@app/pluto-config';

async function bootstrap() {
  // 创建服务上下文
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const plutoConfigService = appContext.get(PlutoConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: plutoConfigService.getServiceTransport(),
      options: {
        port: plutoConfigService.getServicePort(),
      },
    },
  );

  await app.listen();
}

bootstrap();
