// nest
import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
// project
import { PlutoConfigModule, PlutoConfigService } from '@app/pluto-config';
import { PlutoClientService } from './pluto-client.service';
import { MicroServiceClientIdentity } from 'assets/enums';

@Module({
  imports: [PlutoConfigModule],
  providers: [
    PlutoClientService,
    {
      provide: MicroServiceClientIdentity.Pluto,
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
  exports: [PlutoClientService, MicroServiceClientIdentity.Pluto],
})
export class PlutoClientModule {}
