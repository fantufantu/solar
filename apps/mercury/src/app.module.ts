// nest

import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
// project
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlutoConfigModule, PlutoConfigService } from '@app/pluto-config';

@Module({
  imports: [PlutoConfigModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'PLUTO_SERVICE',
      useFactory: (plutoConfigService: PlutoConfigService) => {
        return ClientProxyFactory.create({
          transport: plutoConfigService.getServiceTransport(),
          options: {
            port: plutoConfigService.getServicePort(),
          },
        });
      },
      inject: [PlutoConfigService],
    },
  ],
})
export class AppModule {}
