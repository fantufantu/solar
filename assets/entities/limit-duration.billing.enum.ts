import { registerEnumType } from '@nestjs/graphql';
import { GRAPHQL_ENUM_TOKEN } from 'constants/common.constant';

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
  name: GRAPHQL_ENUM_TOKEN.BILLING_LIMIT_DURATION,
  description: '限制时间段',
});
