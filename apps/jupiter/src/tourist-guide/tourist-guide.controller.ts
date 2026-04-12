import { Body, Controller, Sse } from '@nestjs/common';
import { TouristGuideService } from './tourist-guide.service';
import { interval, map } from 'rxjs';
import { PlanInput } from './dto/plan.input';

@Controller('tourist-guide')
export class TouristGuideController {
  constructor(private readonly touristGuideService: TouristGuideService) {}

  @Sse('plan')
  plan(@Body() input: PlanInput) {
    return this.touristGuideService.plan(input);
  }
}
