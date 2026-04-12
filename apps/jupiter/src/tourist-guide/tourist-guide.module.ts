import { Module } from '@nestjs/common';
import { TouristGuideService } from './tourist-guide.service';
import { TouristGuideController } from './tourist-guide.controller';

@Module({
  controllers: [TouristGuideController],
  providers: [TouristGuideService],
})
export class TouristGuideModule {}
