// nest
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
// project
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryBy } from './dto/create-category-by.input';
import { UpdateCategoryBy } from './dto/update-category-by.input';
import { CategoryLoader } from './category.loader';
import { FilterCategoryBy } from './dto/filter-category-by.input';
import { PaginateBy } from 'assets/dto';
import { Filter, Pagination } from 'assets/decorators';
import { PaginatedCategories } from './dto/paginated-categories';
import { PaginatedInterceptor } from 'assets/interceptor/paginated.interceptor';
import { UseInterceptors } from '@nestjs/common';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categoryLoader: CategoryLoader,
  ) {}

  @Mutation(() => Category, {
    description: '创建分类',
  })
  createCategory(@Args('createBy') createCategoryBy: CreateCategoryBy) {
    return this.categoryService.create(createCategoryBy);
  }

  @Query(() => PaginatedCategories, {
    name: 'categories',
    description: '分页查询分类',
  })
  @UseInterceptors(PaginatedInterceptor)
  getCategories(
    @Pagination() paginateBy: PaginateBy,
    @Filter() filterBy: FilterCategoryBy,
  ) {
    return this.categoryService.getCategories({
      paginateBy,
      filterBy,
    });
  }

  @Query(() => Category, { name: 'category', description: '查询单个分类' })
  getCategory(
    @Args('id', { type: () => Int, description: '分类id' }) id: number,
  ) {
    return this.categoryService.getCategory(id);
  }

  @Mutation(() => Boolean, {
    description: '更新分类',
  })
  updateCategory(
    @Args('id', {
      type: () => Int,
      description: '分类id',
    })
    id: number,
    @Args('updateBy', {
      description: '分类',
    })
    updateBy: UpdateCategoryBy,
  ) {
    return this.categoryService.update(id, updateBy);
  }

  @Mutation(() => Boolean, {
    description: '删除分类',
  })
  removeCategory(
    @Args('id', { type: () => Int, description: '分类id' }) id: number,
  ) {
    return this.categoryService.remove(id);
  }

  @ResolveField('amount', () => Int, {
    description: '总金额',
  })
  getExpense(@Parent() category: Category) {
    return this.categoryLoader.getAmountGroupedByCategory.load(category.id);
  }
}
