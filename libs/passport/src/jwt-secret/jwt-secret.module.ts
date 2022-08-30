// nest
import { Module } from '@nestjs/common';
// project
import { PlutoClientModule, PlutoClientService } from '@app/pluto-client';
import {
  ConfigJwtProperty,
  ConfigRegisterToken,
  CustomProviderToken,
  PlutoServiceCmd,
} from 'assets/enums';

@Module({
  imports: [PlutoClientModule],
  providers: [
    {
      provide: CustomProviderToken.JwtSecretService,
      inject: [PlutoClientService],
      useFactory: async (plutoClientService: PlutoClientService) => {
        return await plutoClientService.send(
          {
            cmd: PlutoServiceCmd.GetConfig,
          },
          {
            token: ConfigRegisterToken.Jwt,
            property: ConfigJwtProperty.Secret,
          },
        );
      },
    },
  ],
  exports: [CustomProviderToken.JwtSecretService],
})
export class JwtSecretModule {}
