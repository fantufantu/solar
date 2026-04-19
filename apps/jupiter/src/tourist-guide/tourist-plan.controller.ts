import { Controller, Param, Sse } from '@nestjs/common';
import { TouristPlanService } from './tourist-plan.service';

@Controller('tourist-plan')
export class TouristPlanController {
  constructor(private readonly touristPlanService: TouristPlanService) {}

  @Sse(':id')
  touristPlan(@Param('id') id: string) {
    return this.touristPlanService.touristPlan(id);
  }
}
