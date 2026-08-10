import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictLoader } from './district.loader';
import { District } from '@/libs/database/entities/jupiter/district.entity';
import { User } from '@/libs/database/entities/jupiter/user.entity';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { PaginatedInterceptor } from 'utils/interceptors/paginated.interceptor';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { FilterArgs } from 'utils/decorators/filter.decorator';
import { Pagination } from 'assets/dto/pagination.input';
import { PaginatedDistricts } from './dto/paginated-districts.object';
import { FilterDistrictsInput } from './dto/filter-districts.input';
import { UpdateDistrictInput } from './dto/update-district.input';
import { CreateDistrictInput } from './dto/create-district.input';

@Resolver(() => District)
export class DistrictResolver {
  constructor(
    private readonly districtService: DistrictService,
    private readonly districtLoader: DistrictLoader,
  ) {}

  @Query(() => PaginatedDistricts, { description: '分页查询行政区' })
  @UseInterceptors(PaginatedInterceptor)
  districts(
    @PaginationArgs()
    pagination: Pagination,
    @FilterArgs({
      type: () => FilterDistrictsInput,
    })
    filter?: FilterDistrictsInput,
  ) {
    return this.districtService.districts({ pagination, filter });
  }

  @Query(() => District, { description: '根据`code`查询行政区' })
  district(
    @Args('code', {
      type: () => String,
    })
    code: string,
  ) {
    return this.districtService.district(code);
  }

  @Mutation(() => Boolean, { description: '创建行政区' })
  @UseGuards(JwtAuthGuard)
  async createDistrict(
    @Args('input') input: CreateDistrictInput,
    @WhoAmI() whoAmI: User,
  ) {
    return this.districtService.create(input, whoAmI.id);
  }

  @Mutation(() => Boolean, { description: '更新行政区' })
  @UseGuards(JwtAuthGuard)
  async updateDistrict(
    @Args('code', {
      type: () => String,
    })
    code: string,
    @Args('input') input: UpdateDistrictInput,
    @WhoAmI() whoAmI: User,
  ) {
    return this.districtService.update(code, input, whoAmI.id);
  }

  @Mutation(() => Boolean, { description: '删除行政区（软删除）' })
  @UseGuards(JwtAuthGuard)
  async deleteDistrict(
    @Args('code', {
      type: () => String,
    })
    code: string,
    @WhoAmI() whoAmI: User,
  ) {
    return this.districtService.delete(code, whoAmI.id);
  }

  @ResolveField('createdBy', () => User, { description: '创建人' })
  getCreatedBy(@Parent() district: District) {
    return { __typename: User.name, id: district.createdById };
  }

  @ResolveField('updatedBy', () => User, { description: '最后更新人' })
  getUpdatedBy(@Parent() district: District) {
    return { __typename: User.name, id: district.updatedById };
  }

  @ResolveField(() => Int, { description: '关联景点数量' })
  attractionCount(@Parent() district: District) {
    return this.districtLoader.attractionCount.load(district.code);
  }

  @ResolveField('parent', () => District, {
    nullable: true,
    description: '父级行政区',
  })
  parent(@Parent() district: District) {
    if (!district.parentCode) return null;
    return this.districtService.district(district.parentCode);
  }

  @ResolveField('children', () => [District], {
    description: '子级行政区列表',
  })
  children(@Parent() district: District) {
    return this.districtLoader.children.load(district.code);
  }
}
