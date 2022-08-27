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
  exports: [
    {
      provide: CustomProviderToken.JwtSecretService,
      imports: [PlutoClientModule],
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
})
export class JwtSecretModule {}
