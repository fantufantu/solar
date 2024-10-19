import { InputType, PickType } from '@nestjs/graphql';
import { Billing } from '@/libs/database/entities/venus/billing.entity';

@InputType()
export class CreateBillingBy extends PickType(Billing, ['name'], InputType) {}
