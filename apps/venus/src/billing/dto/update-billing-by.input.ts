import { CreateBillingBy } from './create-billing-by.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBillingBy extends PartialType(CreateBillingBy) {}
