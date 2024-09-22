import { Field, InputType } from '@nestjs/graphql';

@InputType('FilterArticleCategoriesBy')
export class FilterCategoriesBy {
  @Field(() => String, { nullable: true, description: '关键词' })
  keyword?: string;
}
