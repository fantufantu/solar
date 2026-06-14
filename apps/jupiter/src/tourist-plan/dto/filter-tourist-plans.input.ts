import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterTouristPlansInput {
  @Field(() => String, {
    description: '出行方案归属方`id`',
  })
  belongToId!: string;
}
