// nest
import { InputType, PickType } from '@nestjs/graphql';
// project
import { Billing } from '../entities/billing.entity';

@InputType()
export class CreateBillingBy extends PickType(Billing, ['name'], InputType) {}
