import { Module } from '@nestjs/common';
import { PlutoClientService } from './pluto-client.service';

@Module({
  providers: [PlutoClientService],
  exports: [PlutoClientService],
})
export class PlutoClientModule {}
