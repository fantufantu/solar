import { registerEnumType } from '@nestjs/graphql';
import { GRAPHQL_ENUM_TOKEN } from 'constants/common.constant';

/**
 * 交易方向
 */
export enum Direction {
  In = 'in',
  Out = 'out',
}

registerEnumType(Direction, {
  name: GRAPHQL_ENUM_TOKEN.TRANSACTION_DIRECTION,
  description: '交易方向',
});
