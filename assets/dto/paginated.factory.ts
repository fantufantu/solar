// nest
import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export const Paginated = <T>(classRef: Type<T>) => {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef], { description: '条目列表' })
    items: T[];

    @Field(() => Int, { description: '总条目数' })
    total: number;
  }

  return PaginatedType;
};
