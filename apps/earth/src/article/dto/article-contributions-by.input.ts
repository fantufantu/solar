import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ArticleContributionsBy {
  @Field(() => Date, { description: '开始时间' })
  from: Date;

  @Field(() => Date, { description: '截止时间' })
  to: Date;
}
