// nest
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dtos';
// project
import { Direction, Transaction } from '../entities/transaction.entity';

@InputType()
export class FilterTransactionInput {
  @Field(() => Int, {
    description: '账本id',
  })
  billingId: number;

  @Field(() => [Direction], {
    description: '交易方向',
  })
  directions: Direction[];
}

@ObjectType()
export class PaginatedTransactions extends Paginated(Transaction) {}
