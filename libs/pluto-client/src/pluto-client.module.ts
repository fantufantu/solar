// nest
import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
// project
import { PlutoClientService } from './pluto-client.service';
import { ProviderToken } from 'assets/tokens';
import { MicroservicePort } from 'assets/ports';

@Global()
@Module({
  providers: [
    PlutoClientService,
    {
      provide: ProviderToken.PlutoClientProxy,
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port: MicroservicePort.Pluto,
          },
        }),
    },
  ],
  exports: [PlutoClientService],
})
export class PlutoClientModule {}
