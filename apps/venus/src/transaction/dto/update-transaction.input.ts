import { CreateTransactionInput } from './create-transaction.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionInput extends PartialType(
  CreateTransactionInput,
) {}
