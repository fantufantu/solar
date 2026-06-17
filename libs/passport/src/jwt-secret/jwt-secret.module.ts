import { Module } from '@nestjs/common';
import { PlutoClientModule, PlutoClientService } from '@/libs/pluto-client';
import { JWT_PROPERTY_TOKEN } from 'constants/common.constant';
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
          property: JWT_PROPERTY_TOKEN.SECRET,
        });
      },
    },
  ],
  exports: [PROVIDER_TOKEN.JWT_SECRET],
})
export class JwtSecretModule {}
