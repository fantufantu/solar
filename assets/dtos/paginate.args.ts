import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginateArgs {
  @Field(() => Int, { defaultValue: 1, description: '当前页码' })
  page: number;

  @Field(() => Int, { description: '查询限制' })
  limit: number;
}
