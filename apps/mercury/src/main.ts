// nest
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// project
import { AppModule } from './app.module';
import { AppServiceIdentity, PlutoServiceCMD } from 'assets/enums';
import { PlutoClientService } from '@app/pluto-client';
import { MercuryConfigService } from '@app/mercury-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const plutoClientService = app.get(PlutoClientService);
  const mercuryConfigService = app.get(MercuryConfigService);

  // 获取服务对应的监听端口
  const port = await plutoClientService.send<number>(
    { cmd: PlutoServiceCMD.GetConfig },
    `port.${AppServiceIdentity.Mercury}`,
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: mercuryConfigService.getServicePort(),
    },
  });

  app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
