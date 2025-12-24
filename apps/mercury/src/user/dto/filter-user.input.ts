import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: '搜索用户的过滤条件',
})
export class FilterUserInput {
  @Field(() => String, {
    nullable: true,
    description: '搜索关键词',
  })
  keyword: string | undefined;
}
