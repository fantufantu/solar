// third
import { Repository } from 'typeorm';
// project
import { QueryParams } from 'typings/api';

/**
 * 对数据库进行分页查询
 */
export const paginateQuery = async <T, F>(
  repository: Repository<T>,
  query?: QueryParams<F>,
) => {
  // 入参存在分页需求，计算 skip 值
  // 入参不存在分页需求，以第一条开始取值 skip = 0
  const skip = query?.paginateInput
    ? (query?.paginateInput?.page - 1) * query?.paginateInput?.limit
    : 0;

  // 生成查询 sql qb
  const queryBuild = repository.createQueryBuilder();

  // 注入where条件
  const filterInput = query?.filterInput || {};

  if (Array.isArray(filterInput)) {
    filterInput.forEach((where) => queryBuild.andWhere(where || {}));
  } else {
    queryBuild.where(filterInput);
  }

  // 执行sql
  const [items, totalCount] = await queryBuild
    .skip(skip)
    .take(query?.paginateInput?.limit)
    .orderBy(query?.sortInput)
    .getManyAndCount();

  // 计算 limit
  const limit = query?.paginateInput
    ? query?.paginateInput.limit
    : items.length;

  // 计算总页数
  const pageCount = !totalCount
    ? 0
    : totalCount === limit
    ? 1
    : Math.floor(totalCount / limit) + 1;

  return {
    items,
    page: query?.paginateInput?.page,
    limit,
    totalCount,
    pageCount,
  };
};
