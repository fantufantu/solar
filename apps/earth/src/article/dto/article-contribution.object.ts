import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ArticleContribution {
  @Field(() => Date, { description: '日期' })
  contributedAt: string;

  @Field(() => Number, { description: '创建数量' })
  count: number;
}
