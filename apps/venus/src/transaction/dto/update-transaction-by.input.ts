import { CreateTransactionBy } from './create-transaction-by.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionBy extends PartialType(CreateTransactionBy) {}
