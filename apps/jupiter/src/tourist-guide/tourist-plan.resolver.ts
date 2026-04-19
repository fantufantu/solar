import { TouristPlanService } from './tourist-plan.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { CreateTouristPlanInput } from './dto/create-tourist-plan.input';

@Resolver(() => TouristPlan)
export class TouristPlanResolver {
  constructor(private readonly touristPlanService: TouristPlanService) {}

  @Mutation(() => TouristPlan, { description: '创建出行计划' })
  createTouristPlan(
    @Args('input') input: CreateTouristPlanInput,
  ): Promise<TouristPlan> {
    return this.touristPlanService.create(input);
  }
}
