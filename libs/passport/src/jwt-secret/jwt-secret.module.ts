import { Module } from '@nestjs/common';
import { PlutoClientModule, PlutoClientService } from '@/libs/pluto-client';
import { JwtPropertyToken, ProviderToken } from 'assets/tokens';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration';

@Module({
  imports: [PlutoClientModule],
  providers: [
    {
      provide: ProviderToken.JwtSecret,
      inject: [PlutoClientService],
      useFactory: async (client: PlutoClientService) => {
        return await client.getConfiguration({
          token: REGISTERED_CONFIGURATION_TOKENS.JWT,
          property: JwtPropertyToken.Secret,
        });
      },
    },
  ],
  exports: [ProviderToken.JwtSecret],
})
export class JwtSecretModule {}
