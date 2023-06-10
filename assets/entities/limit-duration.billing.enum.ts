// nest
import { registerEnumType } from '@nestjs/graphql';
// project
import { GraphQLEnumToken } from 'assets/tokens';

/**
 * 限制时间段
 */
export enum LimitDuration {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

registerEnumType(LimitDuration, {
  name: GraphQLEnumToken.BillingLimitDuration,
  description: '限制时间段',
});
