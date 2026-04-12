import { Body, Controller } from '@nestjs/common';
import { TouristGuideService } from './tourist-guide.service';
import { PlanInput } from './dto/plan.input';
import { PostSse } from 'utils/decorators/sse.decorator';

@Controller('tourist-guide')
export class TouristGuideController {
  constructor(private readonly touristGuideService: TouristGuideService) {}

  @PostSse('plan')
  plan(@Body() input: PlanInput) {
    return this.touristGuideService.plan(input);
  }
}
