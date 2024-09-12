import { Module } from '@nestjs/common';
import { EarthController } from './earth.controller';
import { EarthService } from './earth.service';

@Module({
  imports: [],
  controllers: [EarthController],
  providers: [EarthService],
})
export class EarthModule {}
