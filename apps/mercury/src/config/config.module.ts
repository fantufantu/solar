// nest
import { Module } from '@nestjs/common';
import { ConfigModule as NativeConfigModule } from '@nestjs/config';
// project
import { jwtConfig, rsaConfig, tenantCloudConfig } from './configurations';
import { ConfigService } from './config.service';

@Module({
  imports: [
    NativeConfigModule.forRoot({
      load: [jwtConfig, rsaConfig, tenantCloudConfig],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
