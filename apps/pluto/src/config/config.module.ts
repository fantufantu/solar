import { Module } from '@nestjs/common';
import { ConfigModule as _ConfigModule } from '@nestjs/config';
import { jwtConfig, rsaConfig, tencentCloudConfig } from './configurations';
import { ConfigService } from './config.service';

@Module({
  imports: [
    _ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, rsaConfig, tencentCloudConfig],
      envFilePath: ['apps/pluto/.env.local', 'apps/pluto/.env'],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
