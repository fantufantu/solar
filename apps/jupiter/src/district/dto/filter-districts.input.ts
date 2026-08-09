import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterDistrictsInput {
  @Field(() => String, { nullable: true, description: '关键词' })
  keyword?: string;
}
