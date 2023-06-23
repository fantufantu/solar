// nest
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GroupTransactionAmountByCategory {
  @Field(() => Int, {
    description: '账本 id',
  })
  billingId: number;

  @Field(() => [Int], {
    description: '分类 id 列表',
    nullable: true,
  })
  categoryIds: number[] | null;

  @Field(() => [Date, Date], {
    description: '发生日期列表',
    nullable: true,
  })
  happenedIn: [Date, Date] | null;
}
