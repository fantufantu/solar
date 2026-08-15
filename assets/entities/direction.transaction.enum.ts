import type { ValueOf } from '@aiszlab/relax/types';
import { registerEnumType } from '@nestjs/graphql';
import { GRAPHQL_ENUM_TOKEN } from 'constants/common.constant';

/**
 * 交易方向
 */
export const DIRECTION = {
  IN: 'in',
  OUT: 'out',
} as const;

export type Direction = ValueOf<typeof DIRECTION>;

registerEnumType(DIRECTION, {
  name: GRAPHQL_ENUM_TOKEN.TRANSACTION_DIRECTION,
  description: '交易方向',
});
