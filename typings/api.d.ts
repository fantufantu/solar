import { PaginationInput } from 'assets/dto/pagination.input';
import { FindOperator, OrderByCondition } from 'typeorm';

export type Filter = Record<string, string | number | boolean | FindOperator>;

export interface QueryBy<F extends Filter | Filter[] = Filter> {
  pagination?: PaginationInput;
  filter?: F;
  sort?: OrderByCondition;
}
