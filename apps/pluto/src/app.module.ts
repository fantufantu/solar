import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [
    // 配置项模块
    ConfigurationModule,
  ],
})
export class AppModule {}
