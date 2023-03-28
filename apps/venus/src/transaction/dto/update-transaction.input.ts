import { CreateTransactionInput } from './create-transaction-by.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionInput extends PartialType(
  CreateTransactionInput,
) {
  @Field(() => Int)
  id: number;
}
