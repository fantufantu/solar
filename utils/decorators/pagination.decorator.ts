import { Args, ArgsOptions } from '@nestjs/graphql';

/**
 * 筛选参数
 */
export const Filter = (options?: Pick<ArgsOptions, 'type' | 'nullable'>) => {
  return Args('filterBy', {
    nullable: true,
    description: '筛选参数',
    ...options,
  });
};
