import { Args } from '@nestjs/graphql';

/**
 * 分页参数
 */
export const Pagination = () => {
  return Args('paginateBy', {
    nullable: true,
    description: '分页参数',
  });
};
