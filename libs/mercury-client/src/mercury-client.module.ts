import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PROVIDER_TOKEN } from 'constants/app.constant';
import { MICRO_SERVICE_PORTS } from 'constants/ports.constant';
import { MercuryClientService } from './mercury-client.service';

@Global()
@Module({
  providers: [
    MercuryClientService,
    {
      provide: PROVIDER_TOKEN.MERCURY_CLIENT_PROXY,
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
