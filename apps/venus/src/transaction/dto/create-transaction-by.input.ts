import { InputType, PickType } from '@nestjs/graphql';
import { Transaction } from '@/libs/database/entities/venus/transaction.entity';

@InputType()
export class CreateTransactionBy extends PickType(
  Transaction,
  ['billingId', 'categoryId', 'amount', 'remark', 'happenedAt'],
  InputType,
) {}
