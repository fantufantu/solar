// nest
import { Field, InputType, Int } from '@nestjs/graphql';
// project
import { Direction } from 'assets/entities/direction.enum';

@InputType()
export class FilterTransactionBy {
  @Field(() => Int, {
    description: '账本id',
  })
  billingId: number;

  @Field(() => [Direction], {
    description: '交易方向',
  })
  directions: Direction[];
}
