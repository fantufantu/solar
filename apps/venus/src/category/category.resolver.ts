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
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { CategoryLoader } from './category.loader';
import {
  FilterCategoryArgs,
  PaginatedCategories,
} from './dto/filter-category.args';
import { PaginateArgs } from 'assets/dtos';
import { Filter, Pagination } from 'assets/decorators';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categoryLoader: CategoryLoader,
  ) {}

  @Mutation(() => Category, {
    description: '创建分类',
  })
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoryService.create(createCategoryInput);
  }

  @Query(() => PaginatedCategories, {
    name: 'categories',
    description: '分页查询分类',
  })
  getCategories(
    @Pagination() paginateArgs: PaginateArgs,
    @Filter() filterArgs: FilterCategoryArgs,
  ) {
    return this.categoryService.getCategories({
      paginateArgs,
      filterArgs,
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
    @Args('updateCategoryInput', {
      description: '分类',
    })
    updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.update(id, updateCategoryInput);
  }

  @Mutation(() => Boolean, {
    description: '删除分类',
  })
  removeCategory(
    @Args('id', { type: () => Int, description: '分类id' }) id: number,
  ) {
    return this.categoryService.remove(id);
  }

  @ResolveField('expense', () => Int, {
    description: '支出',
  })
  getExpense(@Parent() category: Category) {
    return this.categoryLoader.getExpenseGroupByCategory.load(category.id);
  }
}
