// nest
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// project
import { PlutoConfigService } from './pluto-config.service';
import { serviceConfig } from './configurations';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [serviceConfig],
    }),
  ],
  providers: [PlutoConfigService],
  exports: [PlutoConfigService],
})
export class PlutoConfigModule {}
