import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from '@/libs/database/entities/earth/category.entity';
import { PaginatedCategories } from './dto/paginated-categories.object';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { PaginatedInterceptor } from 'assets/interceptors/paginated.interceptor';
import { Pagination } from 'assets/dto/pagination.input';
import { FilterArticleCategoriesInput } from './dto/filter-categories.input';
import { CreateArticleCategoryInput } from './dto/create-category.input';
import { UpdateArticleCategoryInput } from './dto/update-category.input';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { FilterArgs } from 'utils/decorators/filter.decorator';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => PaginatedCategories, {
    name: 'articleCategories',
    description: '分页查询文章分类',
  })
  @UseInterceptors(PaginatedInterceptor)
  getCategories(
    @PaginationArgs() pagination: Pagination,
    @FilterArgs({
      type: () => FilterArticleCategoriesInput,
    })
    filter?: FilterArticleCategoriesInput,
  ) {
    return this.categoryService.getCategories({
      pagination,
      filter,
    });
  }

  @Mutation(() => Category, {
    name: 'createArticleCategory',
    description: '创建文章分类',
  })
  @UseGuards(JwtAuthGuard)
  async create(@Args('input') input: CreateArticleCategoryInput) {
    return await this.categoryService.create(input);
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
    @Args('input') input: UpdateArticleCategoryInput,
  ) {
    return await this.categoryService.update(id, input);
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
