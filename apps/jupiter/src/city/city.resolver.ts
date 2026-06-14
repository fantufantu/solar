import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { CityService } from './city.service';
import { CityLoader } from './city.loader';
import { City } from '@/libs/database/entities/jupiter/city.entity';
import { User } from '@/libs/database/entities/jupiter/user.entity';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { PaginatedInterceptor } from 'utils/interceptors/paginated.interceptor';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { FilterArgs } from 'utils/decorators/filter.decorator';
import { Pagination } from 'assets/dto/pagination.input';
import { PaginatedCities } from './dto/paginated-cities.object';
import { FilterCitiesInput } from './dto/filter-cities.input';
import { UpdateCityInput } from './dto/update-city.input';
import { CreateCityInput } from './dto/create-city.input';

@Resolver(() => City)
export class CityResolver {
  constructor(
    private readonly cityService: CityService,
    private readonly cityLoader: CityLoader,
  ) {}

  @Query(() => PaginatedCities, { description: '分页查询城市' })
  @UseInterceptors(PaginatedInterceptor)
  cities(
    @PaginationArgs() pagination: Pagination,
    @FilterArgs({
      type: () => FilterCitiesInput,
    })
    filter?: FilterCitiesInput,
  ) {
    return this.cityService.cities({ pagination, filter });
  }

  @Query(() => City, { description: '根据`code`查询城市' })
  city(
    @Args('code', {
      type: () => String,
    })
    code: string,
  ) {
    return this.cityService.city(code);
  }

  @Mutation(() => Boolean, { description: '创建城市' })
  @UseGuards(JwtAuthGuard)
  async createCity(
    @Args('input') input: CreateCityInput,
    @WhoAmI() whoAmI: User,
  ) {
    return this.cityService.create(input, whoAmI.id);
  }

  @Mutation(() => Boolean, { description: '更新城市' })
  @UseGuards(JwtAuthGuard)
  async updateCity(
    @Args('code', {
      type: () => String,
    })
    code: string,
    @Args('input') input: UpdateCityInput,
    @WhoAmI() whoAmI: User,
  ) {
    return this.cityService.update(code, input, whoAmI.id);
  }

  @ResolveField('createdBy', () => User, { description: '创建人' })
  getCreatedBy(@Parent() city: City) {
    return { __typename: User.name, id: city.createdById };
  }

  @ResolveField('updatedBy', () => User, { description: '最后更新人' })
  getUpdatedBy(@Parent() city: City) {
    return { __typename: User.name, id: city.updatedById };
  }

  @ResolveField(() => Int, { description: '关联景点数量' })
  attractionCount(@Parent() city: City) {
    return this.cityLoader.attractionCount.load(city.code);
  }
}
