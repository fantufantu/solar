import { Module } from '@nestjs/common';
import { TouristPlanService } from './tourist-plan.service';
import { TouristPlanController } from './tourist-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { TouristPlanResolver } from './tourist-plan.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TouristPlan]), UserModule],
  controllers: [TouristPlanController],
  providers: [TouristPlanService, TouristPlanResolver],
})
export class TouristPlanModule {}
