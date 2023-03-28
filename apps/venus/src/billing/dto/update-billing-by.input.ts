import { CreateBillingBy } from './create-billing-by.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBillingBy extends PartialType(CreateBillingBy) {
  @Field(() => Int)
  id: number;
}
