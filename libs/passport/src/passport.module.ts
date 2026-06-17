import { Global, Module } from '@nestjs/common';
import { PassportModule as _PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PassportService } from './passport.service';
import { MercuryClientModule } from 'libs/mercury-client/src';
import { JwtSecretModule } from './jwt-secret/jwt-secret.module';
import { PROVIDER_TOKEN } from 'constants/app.constant';
import { JwtStrategy } from './strategies';

@Global()
@Module({
  imports: [
    // passport
    _PassportModule,
    // mercury 微服务
    MercuryClientModule,
    // jwt 密钥
    JwtSecretModule,
    // jwt 模块
    JwtModule.registerAsync({
      imports: [JwtSecretModule],
      inject: [PROVIDER_TOKEN.JWT_SECRET],
      useFactory: (secret: string) => {
        return {
          secret,
        };
      },
    }),
  ],
  providers: [PassportService, JwtStrategy],
  exports: [PassportService],
})
export class PassportModule {}
