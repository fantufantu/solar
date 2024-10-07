import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterArticlesBy {
  @Field(() => [Int], { nullable: true, description: '标签code列表' })
  categoryCodes?: number[];
}
