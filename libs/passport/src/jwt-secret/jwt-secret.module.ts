import { Module } from '@nestjs/common';
import { PlutoClientModule, PlutoClientService } from '@/libs/pluto-client';
import { JwtPropertyToken } from 'assets/tokens';
import { PROVIDER_TOKEN } from 'constants/app.constant';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration.constant';

@Module({
  imports: [PlutoClientModule],
  providers: [
    {
      provide: PROVIDER_TOKEN.JWT_SECRET,
      inject: [PlutoClientService],
      useFactory: async (client: PlutoClientService) => {
        return await client.getConfiguration({
          token: REGISTERED_CONFIGURATION_TOKENS.JWT,
          property: JwtPropertyToken.Secret,
        });
      },
    },
  ],
  exports: [PROVIDER_TOKEN.JWT_SECRET],
})
export class JwtSecretModule {}
