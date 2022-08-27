// nest
import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
// project
import { MercuryConfigModule, MercuryConfigService } from '@app/mercury-config';
import { CustomProviderToken } from 'assets/enums';
import { MercuryClientService } from './mercury-client.service';

@Module({
  imports: [MercuryConfigModule],
  providers: [
    MercuryClientService,
    {
      provide: CustomProviderToken.MercuryClientProxy,
      inject: [MercuryConfigService],
      useFactory: (mercuryConfigService: MercuryConfigService) =>
        ClientProxyFactory.create({
          transport: mercuryConfigService.getServiceTransport(),
          options: {
            port: mercuryConfigService.getServicePort(),
          },
        }),
    },
  ],
  exports: [MercuryClientService],
})
export class MercuryClientModule {}
