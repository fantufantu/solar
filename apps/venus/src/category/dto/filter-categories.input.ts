import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterTransactionCategoryInput {
  @Field(() => [Int], {
    description: '分类id列表',
  })
  ids: number[];
}
