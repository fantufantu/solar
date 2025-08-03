import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterTransactionsAmountInput {
  @Field(() => Int, {
    description: '账本id',
  })
  billingId: number;

  @Field(() => [Int], {
    description: '分类id列表',
    nullable: true,
  })
  categoryIds: number[] | null;

  @Field(() => Date, {
    description: '交易发生的起始时间',
    nullable: true,
  })
  happenedFrom: Date | null;

  @Field(() => Date, {
    description: '交易发生的截止时间',
    nullable: true,
  })
  happenedTo: Date | null;
}
