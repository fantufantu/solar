// nest
import { Module } from '@nestjs/common';
// project
import { PlutoClientModule, PlutoClientService } from '@app/pluto-client';
import {
  ConfigRegisterToken,
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
        return await client.getConfig({
          token: ConfigRegisterToken.Jwt,
          property: JwtPropertyToken.Secret,
        });
      },
    },
  ],
  exports: [ProviderToken.JwtSecretService],
})
export class JwtSecretModule {}
