import { Pagination } from 'assets/dto/pagination.input';
import { ObjectLiteral, OrderByCondition } from 'typeorm';

/**
 * @description 标准化的查询参数
 */
export interface Query<F extends ObjectLiteral | ObjectLiteral[]> {
  pagination?: Pagination;
  filter?: F;
  sort?: OrderByCondition;
}
