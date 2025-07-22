import { Args } from '@nestjs/graphql';

/**
 * 排序参数
 */
export const Sort = () => {
  return Args('sort', {
    nullable: true,
    description: '排序参数',
  });
};
