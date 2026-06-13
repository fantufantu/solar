import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterAttractionsInput {
  @Field(() => String, { nullable: true, description: '关键词' })
  keyword?: string;

  @Field(() => String, { nullable: true, description: '目的地城市`code`' })
  cityCode?: string;
}
