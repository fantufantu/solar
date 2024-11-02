import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  jwtConfig,
  rsaConfig,
  tencentCloudConfig,
  openaiConfig,
} from './configurations';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, rsaConfig, tencentCloudConfig, openaiConfig],
      envFilePath: ['apps/pluto/.env.local', 'apps/pluto/.env'],
    }),
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
})
export class ConfigurationModule {}
