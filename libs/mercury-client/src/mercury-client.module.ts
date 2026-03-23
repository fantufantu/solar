import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ProviderToken } from 'assets/tokens';
import { MICRO_SERVICE_PORTS } from 'constants/ports';
import { MercuryClientService } from './mercury-client.service';

@Global()
@Module({
  providers: [
    MercuryClientService,
    {
      provide: ProviderToken.MercuryClientProxy,
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port: MICRO_SERVICE_PORTS.MERCURY,
          },
        }),
    },
  ],
  exports: [MercuryClientService],
})
export class MercuryClientModule {}
