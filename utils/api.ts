import { ObjectLiteral, Repository } from 'typeorm';
import { QueryBy } from 'typings/api';

/**
 * 对数据库进行分页查询
 */
export const paginateQuery = async <
  T extends ObjectLiteral,
  F extends ObjectLiteral | ObjectLiteral[],
>(
  repository: Repository<T>,
  queryBy?: QueryBy<F>,
) => {
  // 入参存在分页需求，计算 skip 值
  // 入参不存在分页需求，以第一条开始取值 skip = 0
  const skip = queryBy?.paginateBy
    ? (queryBy?.paginateBy?.page - 1) * queryBy?.paginateBy?.limit
    : 0;

  // 生成查询 sql qb
  const queryBuild = repository.createQueryBuilder();

  // 注入 where 条件
  const filterBy = queryBy?.filterBy;

  if (Array.isArray(filterBy)) {
    filterBy.forEach((where) => queryBuild.andWhere(where || {}));
  } else {
    filterBy && queryBuild.where(filterBy);
  }

  // 注入分页参数
  queryBuild.skip(skip).take(queryBy?.paginateBy?.limit);

  // 注入排序参数
  queryBy?.sortBy && queryBuild.orderBy(queryBy.sortBy);

  // 执行sql
  return await queryBuild.getManyAndCount();
};
