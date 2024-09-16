import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionAmountGroupedByCategory {
  @Field(() => Int, {
    description: '分类id',
  })
  categoryId: number;

  @Field(() => Float, {
    description: '合计金额',
  })
  amount: number;
}
