// nest
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionAmountGroupedBySubject {
  @Field(() => Int, {
    description: '科目id',
  })
  subjectId: number;

  @Field(() => Float, {
    description: '合计金额',
  })
  amount: number;
}
