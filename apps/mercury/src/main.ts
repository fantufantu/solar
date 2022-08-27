// nest
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
// project
import { AppModule } from './app.module';
import { AppServiceIdentity, PlutoServiceCmd } from 'assets/enums';
import { PlutoClientService } from '@app/pluto-client';
import { MercuryConfigService } from '@app/mercury-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const plutoClientService = app.get(PlutoClientService);
  const mercuryConfigService = app.get(MercuryConfigService);

  // 获取服务对应的监听端口
  const port = await plutoClientService.send<number>(
    { cmd: PlutoServiceCmd.GetConfig },
    `port.${AppServiceIdentity.Mercury}`,
  );

  // 创建微服务
  app.connectMicroservice<MicroserviceOptions>({
    transport: mercuryConfigService.getServiceTransport(),
    options: {
      port: mercuryConfigService.getServicePort(),
    },
  });

  app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
