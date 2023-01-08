import { CreateAccountBookInput } from './create-account-book.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAccountBookInput extends PartialType(CreateAccountBookInput) {
  @Field(() => Int)
  id: number;
}
