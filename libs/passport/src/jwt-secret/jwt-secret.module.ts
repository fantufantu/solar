import { PlutoClientModule, PlutoClientService } from '@app/pluto-client';
import { Module } from '@nestjs/common';
import { CustomProviderToken, PlutoServiceCMD } from 'assets/enums';

@Module({
  exports: [
    {
      provide: CustomProviderToken.JwtSecretService,
      imports: [PlutoClientModule],
      inject: [PlutoClientService],
      useFactory: async (plutoClientService: PlutoClientService) => {
        return await plutoClientService.send(
          {
            cmd: PlutoServiceCMD.GetConfig,
          },
          'jwt.secret',
        );
      },
    },
  ],
})
export class JwtSecretModule {}
