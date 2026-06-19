import { Module } from '@nestjs/common';
import { TouristPlanService } from './tourist-plan.service';
import { TouristPlanController } from './tourist-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { TouristPlanResolver } from './tourist-plan.resolver';
import { TouristPlanLoader } from './tourist-plan.loader';
import { TouristPlanItineraryModule } from '../tourist-plan-itinerary/tourist-plan-itinerary.module';
import { UserModule } from '../user/user.module';
import { CityModule } from '../city/city.module';
import { AttractionModule } from '../attraction/attraction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TouristPlan]),
    TouristPlanItineraryModule,
    UserModule,
    CityModule,
    AttractionModule,
  ],
  controllers: [TouristPlanController],
  providers: [
    TouristPlanService,
    TouristPlanResolver,
    TouristPlanLoader,
  ],
})
export class TouristPlanModule {}
