import { TouristPlanService } from './tourist-plan.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { CreateTouristPlanInput } from './dto/create-tourist-plan.input';
import { Pagination } from 'assets/dto/pagination.input';
import { PaginatedTouristPlans } from './dto/paginated-tourist-plans.object';
import { PaginatedInterceptor } from 'assets/interceptors/paginated.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { FilterArgs } from 'utils/decorators/filter.decorator';
import { FilterTouristPlansInput } from './dto/filter-tourist-plans.input';

@Resolver(() => TouristPlan)
export class TouristPlanResolver {
  constructor(private readonly touristPlanService: TouristPlanService) {}

  @Mutation(() => TouristPlan, { description: '创建出行计划' })
  createTouristPlan(
    @Args('input') input: CreateTouristPlanInput,
  ): Promise<TouristPlan> {
    return this.touristPlanService.create(input);
  }

  @Query(() => TouristPlan, { description: '获取出行计划' })
  touristPlan(@Args('id') id: string): Promise<TouristPlan> {
    return this.touristPlanService.touristPlan(id);
  }

  @Query(() => PaginatedTouristPlans, {
    name: 'touristPlans',
    description: '分页查询出行计划列表',
  })
  @UseInterceptors(PaginatedInterceptor)
  touristPlans(
    @FilterArgs({ type: () => FilterTouristPlansInput, nullable: false })
    filter: FilterTouristPlansInput,
    @PaginationArgs() pagination: Pagination,
  ) {
    return this.touristPlanService.touristPlans({ filter, pagination });
  }
}
