import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '@/lib/database/entities/venus/category.entity';
import { CreateCategoryBy } from './dto/create-category-by.input';
import { UpdateCategoryBy } from './dto/update-category-by.input';
import { FilterCategoriesBy } from './dto/filter-categories-by.input';
import { PaginateBy } from 'assets/dto/paginate-by.input';
import { Filter, Pagination } from 'assets/decorators';
import { PaginatedCategories } from './dto/paginated-categories.object';
import { PaginatedInterceptor } from 'assets/interceptor/paginated.interceptor';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category, {
    name: 'createTransactionCategory',
    description: '创建交易分类',
  })
  create(@Args('createBy') createBy: CreateCategoryBy) {
    return this.categoryService.create(createBy);
  }

  @Query(() => PaginatedCategories, {
    name: 'transactionCategories',
    description: '分页查询交易分类',
  })
  @UseInterceptors(PaginatedInterceptor)
  getCategories(
    @Pagination() paginateBy: PaginateBy,
    @Filter() filterBy: FilterCategoriesBy,
  ) {
    return this.categoryService.getCategories({
      paginateBy,
      filterBy,
    });
  }

  @Query(() => Category, {
    name: 'transactionCategory',
    description: '查询单个交易分类',
  })
  getCategory(
    @Args('id', { type: () => Int, description: '交易分类id' }) id: number,
  ) {
    return this.categoryService.getCategory(id);
  }

  @Mutation(() => Boolean, {
    name: 'updateTransactionCategory',
    description: '更新交易分类',
  })
  update(
    @Args('id', {
      type: () => Int,
      description: '交易分类id',
    })
    id: number,
    @Args('updateBy', {
      description: '交易分类',
    })
    updateBy: UpdateCategoryBy,
  ) {
    return this.categoryService.update(id, updateBy);
  }

  @Mutation(() => Boolean, {
    name: 'removeTransactionCategory',
    description: '删除交易分类',
  })
  remove(@Args('id', { type: () => Int, description: '分类id' }) id: number) {
    return this.categoryService.remove(id);
  }
}
