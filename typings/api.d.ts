import { PaginateBy } from 'assets/dto/paginate-by.input';
import { ObjectLiteral, OrderByCondition } from 'typeorm';

export interface QueryBy<F extends ObjectLiteral | ObjectLiteral[]> {
  paginateBy?: PaginateBy;
  filterBy?: F;
  sortBy?: OrderByCondition;
}
