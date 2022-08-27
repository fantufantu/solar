// nest
import { Type } from '@nestjs/common';
import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
// project
import { PaginateInput } from './paginate.input';

export const Paginated = <T>(classRef: Type<T>): any => {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType extends PickType(
    PaginateInput,
    ['page', 'limit'],
    ObjectType,
  ) {
    @Field(() => [classRef], { description: '条目列表' })
    items: T[];

    @Field(() => Int, { description: '总条目数' })
    totalCount: number;

    @Field(() => Int, { description: '总页数' })
    pageCount: number;
  }

  return PaginatedType;
};
