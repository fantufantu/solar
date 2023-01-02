// nest
import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
// project
import { ProviderToken } from 'assets/tokens';
import { MicroservicePort } from 'assets/ports';
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
            port: MicroservicePort.Mercury,
          },
        }),
    },
  ],
  exports: [MercuryClientService],
})
export class MercuryClientModule {}
