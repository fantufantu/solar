// nest
import { Module } from '@nestjs/common';
// project
import { MercuryClientModule, MercuryClientService } from '@app/mercury-client';
import {
  ConfigRegisterToken,
  JwtPropertyToken,
  ProviderToken,
} from 'assets/tokens';

@Module({
  imports: [MercuryClientModule],
  providers: [
    {
      provide: ProviderToken.JwtSecretService,
      inject: [MercuryClientService],
      useFactory: async (client: MercuryClientService) => {
        // return await client.getConfig(
        //   `${ConfigRegisterToken.Jwt}.${JwtPropertyToken.Secret}`,
        // );
        return '11';
      },
    },
  ],
  exports: [ProviderToken.JwtSecretService],
})
export class JwtSecretModule {}
