// third
import { Repository } from 'typeorm';
// project
import { QueryParameters } from 'typings/api';

/**
 * 对数据库进行分页查询
 */
export const paginateQuery = async <T, F>(
  repository: Repository<T>,
  queryArgs?: QueryParameters<F>,
) => {
  // 入参存在分页需求，计算 skip 值
  // 入参不存在分页需求，以第一条开始取值 skip = 0
  const skip = queryArgs?.paginateArgs
    ? (queryArgs?.paginateArgs?.page - 1) * queryArgs?.paginateArgs?.limit
    : 0;

  // 生成查询 sql qb
  const queryBuild = repository.createQueryBuilder();

  // 注入where条件
  const filterArgs = queryArgs?.filterArgs || {};

  if (Array.isArray(filterArgs)) {
    filterArgs.forEach((where) => queryBuild.andWhere(where || {}));
  } else {
    queryBuild.where(filterArgs);
  }

  // 执行sql
  const [items, totalCount] = await queryBuild
    .skip(skip)
    .take(queryArgs?.paginateArgs?.limit)
    .orderBy(queryArgs?.sortArgs)
    .getManyAndCount();

  // 计算 limit
  const limit = queryArgs?.paginateArgs
    ? queryArgs?.paginateArgs.limit
    : items.length;

  // 计算总页数
  const pageCount = !totalCount
    ? 0
    : totalCount === limit
    ? 1
    : Math.floor(totalCount / limit) + 1;

  return {
    items,
    page: queryArgs?.paginateArgs?.page,
    limit,
    totalCount,
    pageCount,
  };
};
