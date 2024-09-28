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
      provide: ProviderToken.JwtSecretService,
      inject: [PlutoClientService],
      useFactory: async (client: PlutoClientService) => {
        return await client.getConfiguration({
          token: ConfigurationRegisterToken.Jwt,
          property: JwtPropertyToken.Secret,
        });
      },
    },
  ],
  exports: [ProviderToken.JwtSecretService],
})
export class JwtSecretModule {}
