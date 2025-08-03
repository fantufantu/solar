import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '@/libs/database/entities/venus/category.entity';
import { CreateTransactionCategoryInput } from './dto/create-category.input';
import { UpdateTransactionCategoryInput } from './dto/update-category.input';
import { FilterTransactionCategoryInput } from './dto/filter-categories.input';
import { Pagination } from 'assets/dto/pagination.input';
import { PaginatedCategories } from './dto/paginated-categories.object';
import { PaginatedInterceptor } from 'assets/interceptors/paginated.interceptor';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { FilterArgs } from 'utils/decorators/filter.decorator';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category, {
    name: 'createTransactionCategory',
    description: '创建交易分类',
  })
  create(@Args('input') input: CreateTransactionCategoryInput) {
    return this.categoryService.create(input);
  }

  @Query(() => PaginatedCategories, {
    description: '分页查询交易分类',
  })
  @UseInterceptors(PaginatedInterceptor)
  transactionCategories(
    @PaginationArgs() pagination: Pagination,
    @FilterArgs() filter: FilterTransactionCategoryInput,
  ) {
    return this.categoryService.categories({
      pagination,
      filter,
    });
  }

  @Query(() => Category, {
    description: '查询单个交易分类',
  })
  transactionCategory(
    @Args('id', { type: () => Int, description: '交易分类id' }) id: number,
  ) {
    return this.categoryService.category(id);
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
    @Args('input', {
      description: '交易分类',
    })
    input: UpdateTransactionCategoryInput,
  ) {
    return this.categoryService.update(id, input);
  }

  @Mutation(() => Boolean, {
    name: 'removeTransactionCategory',
    description: '删除交易分类',
  })
  remove(@Args('id', { type: () => Int, description: '分类id' }) id: number) {
    return this.categoryService.remove(id);
  }
}
