import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TimeRangeInput {
  @Field(() => Date, {
    description: '起始时间',
    nullable: true,
  })
  from?: Date;

  @Field(() => Date, {
    description: '截止时间',
    nullable: true,
  })
  to?: Date;
}
