import { PaginateArgs } from 'assets/dtos/pagination.input';

interface SortArgs {
  [columnName: string]:
    | ('ASC' | 'DESC')
    | {
        order: 'ASC' | 'DESC';
        nulls?: 'NULLS FIRST' | 'NULLS LAST';
      };
}

export interface QueryParameters<F = Record<string, any>> {
  pagination?: PaginateArgs;
  filter?: F;
  sort?: SortArgs;
}
