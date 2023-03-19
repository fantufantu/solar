// third
import { Repository } from 'typeorm';
// project
import { Filter, QueryParameters } from 'typings/api';

/**
 * 对数据库进行分页查询
 */
export const paginateQuery = async <T, F extends Filter | Filter[]>(
  repository: Repository<T>,
  queryParams?: QueryParameters<F>,
) => {
  // 入参存在分页需求，计算 skip 值
  // 入参不存在分页需求，以第一条开始取值 skip = 0
  const skip = queryParams?.pagination
    ? (queryParams?.pagination?.page - 1) * queryParams?.pagination?.limit
    : 0;

  // 生成查询 sql qb
  const queryBuild = repository.createQueryBuilder();

  // 注入 where 条件
  const filterArgs = queryParams?.filter;

  if (Array.isArray(filterArgs)) {
    filterArgs.forEach((where) => queryBuild.andWhere(where || {}));
  } else {
    queryBuild.where(filterArgs);
  }

  // 执行sql
  return await queryBuild
    .skip(skip)
    .take(queryParams?.pagination?.limit)
    .orderBy(queryParams?.sort)
    .getManyAndCount();
};
