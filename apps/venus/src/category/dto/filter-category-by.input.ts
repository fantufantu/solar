import { Field, InputType, Int } from '@nestjs/graphql';

@InputType('FilterTransactionCategoryBy')
export class FilterCategoryBy {
  @Field(() => [Int], {
    description: '分类id列表',
  })
  ids: number[];
}
