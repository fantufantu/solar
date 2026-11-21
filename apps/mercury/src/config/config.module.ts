import { Module } from '@nestjs/common';
import { ConfigResolver } from './config.resolver';
import { ConfigService } from './config.service';

@Module({
  imports: [],
  providers: [ConfigResolver, ConfigService],
})
export class ConfigModule {}
