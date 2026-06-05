import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AttractionService } from './attraction.service';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { User } from '@/libs/database/entities/jupiter/user.entity';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { PaginatedInterceptor } from 'utils/interceptors/paginated.interceptor';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { FilterArgs } from 'utils/decorators/filter.decorator';
import { Pagination } from 'assets/dto/pagination.input';
import { PaginatedAttractions } from './dto/paginated-attractions.object';
import { FilterAttractionsInput } from './dto/filter-attractions.input';
import { UpdateAttractionInput } from './dto/update-attraction.input';

@Resolver(() => Attraction)
export class AttractionResolver {
  constructor(private readonly attractionService: AttractionService) {}

  @Query(() => PaginatedAttractions, { description: '分页查询景区' })
  @UseInterceptors(PaginatedInterceptor)
  attractions(
    @PaginationArgs() pagination: Pagination,
    @FilterArgs({
      type: () => FilterAttractionsInput,
    })
    filter?: FilterAttractionsInput,
  ) {
    return this.attractionService.attractions({ pagination, filter });
  }

  @Query(() => Attraction, { description: '根据`code`查询景区' })
  attraction(
    @Args('code', {
      type: () => String,
    })
    code: string,
  ) {
    return this.attractionService.attraction(code);
  }

  @Mutation(() => Boolean, { description: '更新景区' })
  @UseGuards(JwtAuthGuard)
  async updateAttraction(
    @Args('code', {
      type: () => String,
    })
    code: string,
    @Args('input') input: UpdateAttractionInput,
    @WhoAmI() whoAmI: User,
  ) {
    return this.attractionService.update(code, input, whoAmI.id);
  }

  @ResolveField('createdBy', () => User, { description: '创建人' })
  createdBy(@Parent() attraction: Attraction) {
    return { __typename: User.name, id: attraction.createdById };
  }

  @ResolveField('updatedBy', () => User, { description: '最后更新人' })
  updatedBy(@Parent() attraction: Attraction) {
    return { __typename: User.name, id: attraction.updatedById };
  }
}
