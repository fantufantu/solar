// nest
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class DurationArgs {
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
