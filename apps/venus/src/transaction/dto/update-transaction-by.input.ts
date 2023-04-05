import { CreateTransactionBy } from './create-transaction-by.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionBy extends PartialType(CreateTransactionBy) {
  @Field(() => Int)
  id: number;
}
