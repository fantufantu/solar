import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1, description: '当前页码' })
  page: number;

  @Field(() => Int, { description: '查询限制' })
  limit: number;
}
