import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  jwtConfig,
  rsaConfig,
  tencentCloudConfig,
  volcArkConfig,
  amapConfig,
} from './configurations/index.js';
import { ConfigurationService } from './configuration.service.js';
import { ConfigurationController } from './configuration.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        jwtConfig,
        rsaConfig,
        tencentCloudConfig,
        volcArkConfig,
        amapConfig,
      ],
      envFilePath: ['.env.local'],
    }),
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
})
export class ConfigurationModule {}
