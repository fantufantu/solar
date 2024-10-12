import { Module } from '@nestjs/common';
import { PlutoClientModule, PlutoClientService } from '@/lib/pluto-client';
import {
  ConfigurationRegisterToken,
  JwtPropertyToken,
  ProviderToken,
} from 'assets/tokens';

@Module({
  imports: [PlutoClientModule],
  providers: [
    {
      provide: ProviderToken.JwtSecret,
      inject: [PlutoClientService],
      useFactory: async (client: PlutoClientService) => {
        return await client.getConfiguration({
          token: ConfigurationRegisterToken.Jwt,
          property: JwtPropertyToken.Secret,
        });
      },
    },
  ],
  exports: [ProviderToken.JwtSecret],
})
export class JwtSecretModule {}
