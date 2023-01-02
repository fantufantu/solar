// nest
import { Global, Module } from '@nestjs/common';
import { PassportModule as NativePassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// project
import { PassportService } from './passport.service';
import { MercuryClientModule } from 'libs/mercury-client/src';
import { JwtSecretModule } from './jwt-secret/jwt-secret.module';
import { ProviderToken } from 'assets/tokens';
import { JwtStrategy } from './strategies';

@Global()
@Module({
  imports: [
    // 原生 passport
    NativePassportModule,
    // mercury 微服务
    MercuryClientModule,
    // jwt 密钥
    JwtSecretModule,
    // jwt 模块
    JwtModule.registerAsync({
      imports: [JwtSecretModule],
      inject: [ProviderToken.JwtSecretService],
      useFactory: (jwtSecretService: string) => {
        return {
          secret: jwtSecretService,
        };
      },
    }),
  ],
  providers: [PassportService, JwtStrategy],
  exports: [PassportService],
})
export class PassportModule {}
