import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '@/lib/database/entities/venus/category.entity';
import { CreateCategoryBy } from './dto/create-category-by.input';
import { UpdateCategoryBy } from './dto/update-category-by.input';
import { FilterCategoryBy } from './dto/filter-category-by.input';
import { PaginateBy } from 'assets/dto/paginate-by.input';
import { Filter, Pagination } from 'assets/decorators';
import { PaginatedCategories } from './dto/paginated-categories';
import { PaginatedInterceptor } from 'assets/interceptor/paginated.interceptor';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category, {
    description: '创建分类',
  })
  create(@Args('createBy') createBy: CreateCategoryBy) {
    return this.categoryService.create(createBy);
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
  update(
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
  remove(@Args('id', { type: () => Int, description: '分类id' }) id: number) {
    return this.categoryService.remove(id);
  }
}
