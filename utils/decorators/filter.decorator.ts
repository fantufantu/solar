import { Args, ArgsOptions } from '@nestjs/graphql';

/**
 * @description 筛选参数
 */
export const FilterArgs = (
  options?: Pick<ArgsOptions, 'type' | 'nullable'>,
) => {
  return Args('filter', {
    nullable: true,
    description: '筛选参数',
    defaultValue: {},
    ...options,
  });
};
