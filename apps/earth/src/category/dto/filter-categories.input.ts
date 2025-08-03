import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterArticleCategoriesInput {
  @Field(() => String, { nullable: true, description: '关键词' })
  keyword?: string;
}
