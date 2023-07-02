// nest
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterTransactionBy {
  @Field(() => Int, {
    description: '账本id',
  })
  billingId: number;

  @Field(() => [Int], {
    description: '分类id列表',
    nullable: true,
  })
  categoryIds: number[] | null;
}
