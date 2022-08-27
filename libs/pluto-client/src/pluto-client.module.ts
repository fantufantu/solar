// nest
import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
// project
import { PlutoConfigModule, PlutoConfigService } from '@app/pluto-config';
import { PlutoClientService } from './pluto-client.service';
import { CustomProviderToken } from 'assets/enums';

@Module({
  imports: [PlutoConfigModule],
  providers: [
    PlutoClientService,
    {
      provide: CustomProviderToken.PlutoClientProxy,
      inject: [PlutoConfigService],
      useFactory: (plutoConfigService: PlutoConfigService) =>
        ClientProxyFactory.create({
          transport: plutoConfigService.getServiceTransport(),
          options: {
            port: plutoConfigService.getServicePort(),
          },
        }),
    },
  ],
  exports: [PlutoClientService],
})
export class PlutoClientModule {}
