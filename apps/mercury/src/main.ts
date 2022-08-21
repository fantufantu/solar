// nest
import { NestFactory } from '@nestjs/core';
// project
import { AppModule } from './app.module';
import { AppServiceIdentity } from 'assets/enums';
import { PlutoClientService } from '@app/pluto-client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const plutoClientService = app.get(PlutoClientService);

  // 获取服务对应的监听端口
  const port = await plutoClientService.send<number>(
    { cmd: 'config.get' },
    `port.${AppServiceIdentity.Mercury}`,
  );

  await app.listen(port);
}
bootstrap();
