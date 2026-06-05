import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterAttractionsInput {
  @Field(() => String, { nullable: true, description: '关键词' })
  keyword?: string;
}
