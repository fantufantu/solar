import { forwardRef, Module } from '@nestjs/common';
import { TouristPlanService } from './tourist-plan.service.js';
import { TouristPlanController } from './tourist-plan.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { TouristPlanResolver } from './tourist-plan.resolver.js';
import { TouristPlanLoader } from './tourist-plan.loader.js';
import { TouristPlanItineraryModule } from '../tourist-plan-itinerary/tourist-plan-itinerary.module.js';
import { UserModule } from '../user/user.module.js';
import { DistrictModule } from '../district/district.module.js';
import { AttractionModule } from '../attraction/attraction.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([TouristPlan]),
    TouristPlanItineraryModule,
    forwardRef(() => UserModule),
    DistrictModule,
    AttractionModule,
  ],
  controllers: [TouristPlanController],
  providers: [TouristPlanService, TouristPlanResolver, TouristPlanLoader],
  exports: [TouristPlanService],
})
export class TouristPlanModule {}
