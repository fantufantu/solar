import { ObjectLiteral, Repository } from 'typeorm';
import { Query } from 'typings/controller';

/**
 * 对数据库进行分页查询
 */
export const paginateQuery = async <
  T extends ObjectLiteral,
  F extends ObjectLiteral | ObjectLiteral[],
>(
  repository: Repository<T>,
  query?: Query<F>,
) => {
  // 入参存在分页需求，计算 skip 值
  // 入参不存在分页需求，以第一条开始取值 skip = 0
  const skip = query?.pagination
    ? (query?.pagination?.page - 1) * query?.pagination?.limit
    : 0;

  // 生成查询 sql qb
  const queryBuild = repository.createQueryBuilder();

  // 注入 where 条件
  const filterBy = query?.filter;

  if (Array.isArray(filterBy)) {
    filterBy.forEach((where) => queryBuild.andWhere(where || {}));
  } else {
    filterBy && queryBuild.where(filterBy);
  }

  // 注入分页参数
  queryBuild.skip(skip).take(query?.pagination?.limit);

  // 注入排序参数
  query?.sort && queryBuild.orderBy(query.sort);

  // 执行sql
  return await queryBuild.getManyAndCount();
};
