import { registerEnumType } from '@nestjs/graphql';
import { GraphQLEnumToken } from 'assets/tokens';

/**
 * 交易方向
 */
export enum Direction {
  In = 'in',
  Out = 'out',
}

registerEnumType(Direction, {
  name: GraphQLEnumToken.TransactionDirection,
  description: '交易方向',
});
