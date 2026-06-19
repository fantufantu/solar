import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouristPlanItinerary } from '@/libs/database/entities/jupiter/tourist-plan-itinerary.entity';
import { TouristPlanItineraryService } from './tourist-plan-itinerary.service';
import { TouristPlanItineraryResolver } from './tourist-plan-itinerary.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TouristPlanItinerary])],
  providers: [TouristPlanItineraryService, TouristPlanItineraryResolver],
  exports: [TouristPlanItineraryService],
})
export class TouristPlanItineraryModule {}
