import { Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from '@/lib/database/entities/earth/category.entity';
import { PaginatedCategories } from './dto/paginated-categories.object';
import { UseInterceptors } from '@nestjs/common';
import { PaginatedInterceptor } from 'assets/interceptor/paginated.interceptor';
import { Filter, Pagination } from 'assets/decorators';
import { PaginateBy } from 'assets/dto/paginate-by.input';
import { FilterCategoriesBy } from './dto/filter-categories-by.input';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => PaginatedCategories, {
    name: 'articleCategories',
    description: '分页查询分类',
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
}
