// nest
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
// project
import { Paginated } from 'assets/dtos';
import { Category } from '../entities/category.entity';

@InputType()
export class FilterCategoryInput {
  @Field(() => [Int], {
    description: '分类 id 列表',
  })
  ids: number[];
}

@ObjectType()
export class PaginatedCategories extends Paginated(Category) {}
