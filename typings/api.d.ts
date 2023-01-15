import { PaginateArgs } from 'assets/dtos/paginate.args';

interface SortArgs {
  [columnName: string]:
    | ('ASC' | 'DESC')
    | {
        order: 'ASC' | 'DESC';
        nulls?: 'NULLS FIRST' | 'NULLS LAST';
      };
}

export interface QueryParameters<F = Record<string, any>> {
  paginateArgs?: PaginateArgs;
  filterArgs?: F;
  sortArgs?: SortArgs;
}
