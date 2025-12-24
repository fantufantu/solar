import { Args } from '@nestjs/graphql';
import { Pagination } from 'assets/dto/pagination.input';

/**
 * 分页参数
 */
export const PaginationArgs = () => {
  return Args('pagination', {
    nullable: true,
    description: '分页参数',
    defaultValue: {
      page: 1,
      limit: 10,
    } satisfies Pagination,
  });
};
