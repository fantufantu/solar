// nest
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterTransactionBy {
  @Field(() => Int, {
    description: '账本id',
  })
  billingId: number;

  @Field(() => [Int], {
    description: '科目id列表',
    nullable: true,
  })
  subjectIds: number[] | null;

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
