import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterCategoryBy {
  @Field(() => [Int], {
    description: '科目id列表',
  })
  ids: number[];
}
