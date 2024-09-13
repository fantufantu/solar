import { InputType, PickType } from '@nestjs/graphql';
import { Transaction } from '../entities/transaction.entity';

@InputType()
export class CreateTransactionBy extends PickType(
  Transaction,
  ['billingId', 'subjectId', 'amount', 'remark', 'happenedAt'],
  InputType,
) {}
