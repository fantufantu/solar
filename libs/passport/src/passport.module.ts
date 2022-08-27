// nest
import { Module } from '@nestjs/common';
import { PassportModule as NativePassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// project
import { PassportService } from './passport.service';
import { MercuryClientModule } from 'libs/mercury-client/src';
import { JwtSecretModule } from './jwt-secret/jwt-secret.module';
import { CustomProviderToken } from 'assets/enums';

@Module({
  imports: [
    // 原生
    NativePassportModule,
    // jwt secret
    JwtSecretModule,
    // 微服务模块注入
    MercuryClientModule,
    // jwt模块
    JwtModule.registerAsync({
      inject: [CustomProviderToken.JwtSecretService],
      useFactory: async (jwtSecretService: string) => ({
        secret: jwtSecretService,
      }),
    }),
  ],
  providers: [PassportService],
  exports: [PassportService],
})
export class PassportModule {}
