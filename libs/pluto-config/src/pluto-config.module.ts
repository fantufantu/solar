// nest
import { Module } from '@nestjs/common';
import { ConfigModule as NativeConfigModule } from '@nestjs/config';
// project
import { PlutoConfigService } from './pluto-config.service';


@Module({
  imports: [NativeConfigModule.forRoot({
    load:[]
  })],
  providers: [PlutoConfigService],
  exports: [PlutoConfigService],
})
export class PlutoConfigModule {}
