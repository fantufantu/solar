import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class RecommendedResumeTemplatesArgs {
  @Field(() => String, {
    nullable: true,
  })
  code?: string;
}
