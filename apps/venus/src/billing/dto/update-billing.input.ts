import { CreateBillingInput } from './create-billing.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBillingInput extends PartialType(CreateBillingInput) {}
