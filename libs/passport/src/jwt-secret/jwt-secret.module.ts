// nest
import { Module } from '@nestjs/common';
// project
import { MercuryClientModule, MercuryClientService } from '@app/mercury-client';
import { ProviderToken } from 'assets/tokens';

@Module({
  imports: [MercuryClientModule],
  providers: [
    {
      provide: ProviderToken.JwtSecretService,
      inject: [MercuryClientService],
      useFactory: async (client: MercuryClientService) => {
        return await client.getJwtSecrect();
      },
    },
  ],
  exports: [ProviderToken.JwtSecretService],
})
export class JwtSecretModule {}
