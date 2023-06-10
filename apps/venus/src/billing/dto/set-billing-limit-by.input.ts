import { LimitDuration } from 'assets/entities/limit-duration.billing.enum';
import { CreateBillingBy } from './create-billing-by.input';
import { InputType, Field, PartialType, Float } from '@nestjs/graphql';

@InputType()
export class SetBillingLimitBy extends PartialType(CreateBillingBy) {
  @Field(() => LimitDuration, {
    description: '限制时间段',
  })
  limitDuration: LimitDuration;

  @Field(() => Float, { description: '限制金额' })
  limitAmount: number;
}
