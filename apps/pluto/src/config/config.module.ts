// nest
import { Module } from '@nestjs/common';
import { ConfigModule as NativeConfigModule } from '@nestjs/config';
// project
import { jwtConfig, rsaConfig, tenantCloudConfig } from './configurations';
import { ConfigService } from './config.service';

@Module({
  imports: [
    NativeConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, rsaConfig, tenantCloudConfig],
      envFilePath: ['apps/pluto/.env.local', 'apps/pluto/.env'],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
