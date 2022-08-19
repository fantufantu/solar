// nest
import { Module } from '@nestjs/common';
import { ConfigModule as NativeConfigModule } from '@nestjs/config';
// project
import { PlutoConfigService } from './pluto-config.service';
import { ServiceConfig } from './configurations';

@Module({
  imports: [
    NativeConfigModule.forRoot({
      load: [ServiceConfig],
    }),
  ],
  providers: [PlutoConfigService],
  exports: [PlutoConfigService],
})
export class PlutoConfigModule {}
