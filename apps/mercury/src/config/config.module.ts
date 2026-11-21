import { Module } from '@nestjs/common';
import { ConfigResolver } from './config.resolver.js';
import { ConfigService } from './config.service.js';

@Module({
  imports: [],
  providers: [ConfigResolver, ConfigService],
})
export class ConfigModule {}
