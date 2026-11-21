import { CreateTransactionInput } from './create-transaction.input.js';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionInput extends PartialType(
  CreateTransactionInput,
) {}
