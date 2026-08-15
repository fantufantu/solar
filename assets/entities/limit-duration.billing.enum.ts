import type { ValueOf } from '@aiszlab/relax/types';
import { registerEnumType } from '@nestjs/graphql';
import { GRAPHQL_ENUM_TOKEN } from 'constants/common.constant';

/**
 * 限制时间段
 */
export const LIMIT_DURATION = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export type LimitDuration = ValueOf<typeof LIMIT_DURATION>;

registerEnumType(LIMIT_DURATION, {
  name: GRAPHQL_ENUM_TOKEN.BILLING_LIMIT_DURATION,
  description: '限制时间段',
});
