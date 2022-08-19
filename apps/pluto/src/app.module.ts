// nest
import { Module } from '@nestjs/common';
// project
import { ConfigModule } from './config/config.module';
import { PlutoConfigModule } from '@app/pluto-config';

@Module({
  imports: [ConfigModule, PlutoConfigModule],
})
export class AppModule {}
