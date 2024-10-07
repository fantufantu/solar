import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterArticlesBy {
  @Field(() => [String], { nullable: true, description: '标签code列表' })
  categoryCodes?: string[];
}
