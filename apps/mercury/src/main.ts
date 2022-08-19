// nest
import { NestFactory } from '@nestjs/core';
// project
import { AppModule } from './app.module';
import { PLUTO_CLIENT } from 'assets/constants';
import { AppServiceIdentity } from 'assets/enums';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const plutoClient = app.get(PLUTO_CLIENT);

  // 获取服务对应的监听端口
  const port = plutoClient.send(
    { cmd: 'sum' },
    `port.${AppServiceIdentity.Mercury}`,
  );

  await app.listen(port);
}
bootstrap();
