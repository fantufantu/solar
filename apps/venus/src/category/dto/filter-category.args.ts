// nest
import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
// project
import { Paginated } from 'assets/dtos';
import { Category } from '../entities/category.entity';

@ArgsType()
export class FilterCategoryArgs {
  @Field(() => [Int], {
    description: '分类 id 列表',
  })
  ids: number[];
}

@ObjectType()
export class PaginatedCategories extends Paginated(Category) {}
