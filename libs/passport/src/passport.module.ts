// nest
import { Module } from '@nestjs/common';
import { PassportModule as NativePassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// project
import { PassportService } from './passport.service';
import { PlutoClientModule, PlutoClientService } from '@app/pluto-client';
import { PlutoServiceCMD } from 'assets/enums';

@Module({
  imports: [
    // 原生
    NativePassportModule,
    // jwt模块
    JwtModule.registerAsync({
      imports: [PlutoClientModule],
      inject: [PlutoClientService],
      useFactory: async (plutoClieSntervice: PlutoClientService) => ({
        secret: await plutoClieSntervice.send(
          {
            cmd: PlutoServiceCMD.GetConfig,
          },
          '',
        ),
      }),
    }),
  ],
  providers: [PassportService],
  exports: [PassportService],
})
export class PassportModule {}
