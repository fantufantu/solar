import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from '@/libs/database/entities/earth/category.entity';
import { PaginatedCategories } from './dto/paginated-categories.object';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { PaginatedInterceptor } from 'assets/interceptors/paginated.interceptor';
import { PaginateBy } from 'assets/dto/paginate-by.input';
import { FilterCategoriesBy } from './dto/filter-categories-by.input';
import { CreateCategoryBy } from './dto/create-category-by.input';
import { UpdateCategoryBy } from './dto/update-category-by.input';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { Pagination } from 'utils/decorators/filter.decorator';
import { Filter } from 'utils/decorators/pagination.decorator';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => PaginatedCategories, {
    name: 'articleCategories',
    description: '分页查询文章分类',
  })
  @UseInterceptors(PaginatedInterceptor)
  getCategories(
    @Pagination() paginateBy: PaginateBy,
    @Filter({
      type: () => FilterCategoriesBy,
    })
    filterBy?: FilterCategoriesBy,
  ) {
    return this.categoryService.getCategories({
      paginateBy,
      filterBy,
    });
  }

  @Mutation(() => Category, {
    name: 'createArticleCategory',
    description: '创建文章分类',
  })
  @UseGuards(JwtAuthGuard)
  async create(@Args('createBy') createBy: CreateCategoryBy) {
    return await this.categoryService.create(createBy);
  }

  @Mutation(() => Boolean, {
    name: 'updateArticleCategory',
    description: '更新文章分类',
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Args('id', {
      type: () => Int,
    })
    id: number,
    @Args('updateBy') updateBy: UpdateCategoryBy,
  ) {
    return await this.categoryService.update(id, updateBy);
  }

  @Mutation(() => Boolean, {
    name: 'removeArticleCategory',
    description: '删除文章分类',
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ) {
    return await this.categoryService.remove(id);
  }

  @Query(() => Category, {
    name: 'articleCategory',
    description: '查询文章分类',
  })
  async getCategory(
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ) {
    return await this.categoryService.getCategory(id);
  }
}
