import { Controller, Param, Sse, UseInterceptors } from '@nestjs/common';
import { TouristPlanService } from './tourist-plan.service';
import { CacheableSseInterceptor } from 'utils/interceptors/cacheable-sse.interceptor';

@Controller('tourist-plan')
export class TouristPlanController {
  constructor(private readonly touristPlanService: TouristPlanService) {}

  @UseInterceptors(CacheableSseInterceptor)
  @Sse('proposal/:id')
  proposal(@Param('id') id: string) {
    return this.touristPlanService.proposal(id);
  }
}
