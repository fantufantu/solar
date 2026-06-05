import { TouristPlanService } from './tourist-plan.service';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { City } from '@/libs/database/entities/jupiter/city.entity';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { CreateTouristPlanInput } from './dto/create-tourist-plan.input';
import { Pagination } from 'assets/dto/pagination.input';
import { PaginatedTouristPlans } from './dto/paginated-tourist-plans.object';
import { PaginatedInterceptor } from 'utils/interceptors/paginated.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { FilterArgs } from 'utils/decorators/filter.decorator';
import { FilterTouristPlansInput } from './dto/filter-tourist-plans.input';
import { TouristPlanLoader } from './tourist-plan.loader';

@Resolver(() => TouristPlan)
export class TouristPlanResolver {
  constructor(
    private readonly touristPlanService: TouristPlanService,
    private readonly touristPlanLoader: TouristPlanLoader,
  ) {}

  @Mutation(() => TouristPlan, { description: '创建出行计划' })
  createTouristPlan(
    @Args('input') input: CreateTouristPlanInput,
  ): Promise<TouristPlan> {
    return this.touristPlanService.create(input);
  }

  @Mutation(() => TouristPlan, { description: '解析出行计划为结构化行程数据' })
  parseTouristPlan(@Args('id') id: string): Promise<TouristPlan> {
    return this.touristPlanService.parseTouristPlan(id);
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

  @ResolveField('cities', () => [City], {
    description: '出行目的地城市列表',
  })
  async cities(@Parent() touristPlan: TouristPlan): Promise<City[]> {
    return (await this.touristPlanLoader.cities.loadMany(touristPlan.cityCodes))
      .values()
      .filter((item): item is City => !!item && !(item instanceof Error))
      .toArray();
  }

  @ResolveField('attractions', () => [Attraction], {
    description: '出行目的地景点列表',
  })
  async attractions(@Parent() touristPlan: TouristPlan): Promise<Attraction[]> {
    return (
      await this.touristPlanLoader.attractions.loadMany(
        touristPlan.attractionCodes,
      )
    )
      .values()
      .filter(
        (item): item is Attraction => !!item && !(item instanceof Error),
      )
      .toArray();
  }
}
