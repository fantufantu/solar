// nest
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class SetDefaultArgs {
  @Field(() => Int, {
    description: '账本ID',
  })
  id: number;

  @Field(() => Boolean, {
    description: '是否默认',
  })
  isDefault: boolean;
}
