import { LimitDuration } from 'assets/entities/limit-duration.billing.enum';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UpdateBillingLimitationInput {
  @Field(() => LimitDuration, {
    description: '限制时间段',
  })
  limitDuration: LimitDuration;

  @Field(() => Float, { description: '限制金额' })
  limitAmount: number;
}
