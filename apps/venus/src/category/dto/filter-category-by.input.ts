// nest
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterCategoryBy {
  @Field(() => [Int], {
    description: '分类 id 列表',
  })
  ids: number[];
}
