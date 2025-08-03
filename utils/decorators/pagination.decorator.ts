import { Args } from '@nestjs/graphql';

/**
 * 分页参数
 */
export const PaginationArgs = () => {
  return Args('pagination', {
    nullable: true,
    description: '分页参数',
  });
};
