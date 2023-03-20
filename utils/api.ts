// third
import { Repository } from 'typeorm';
// project
import { Filter, QueryBy } from 'typings/api';

/**
 * 对数据库进行分页查询
 */
export const paginateQuery = async <T, F extends Filter | Filter[] = Filter>(
  repository: Repository<T>,
  queryBy?: QueryBy<F>,
) => {
  // 入参存在分页需求，计算 skip 值
  // 入参不存在分页需求，以第一条开始取值 skip = 0
  const skip = queryBy?.pagination
    ? (queryBy?.pagination?.page - 1) * queryBy?.pagination?.limit
    : 0;

  // 生成查询 sql qb
  const queryBuild = repository.createQueryBuilder();

  // 注入 where 条件
  const filterArgs = queryBy?.filter;

  if (Array.isArray(filterArgs)) {
    filterArgs.forEach((where) => queryBuild.andWhere(where || {}));
  } else {
    queryBuild.where(filterArgs);
  }

  // 执行sql
  return await queryBuild
    .skip(skip)
    .take(queryBy?.pagination?.limit)
    .orderBy(queryBy?.sort)
    .getManyAndCount();
};
