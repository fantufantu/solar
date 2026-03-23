import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PlutoClientService } from './pluto-client.service';
import { ProviderToken } from 'assets/tokens';
import { MICRO_SERVICE_PORTS } from 'constants/ports';

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
            port: MICRO_SERVICE_PORTS.PLUTO,
          },
        }),
    },
  ],
  exports: [PlutoClientService],
})
export class PlutoClientModule {}
