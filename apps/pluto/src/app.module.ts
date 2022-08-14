// nest
import { Module } from '@nestjs/common';
// project
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule],
})
export class AppModule {}
