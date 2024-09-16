import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SetDefaultBillingBy {
  @Field(() => Int, {
    description: '账本ID',
  })
  id: number;

  @Field(() => Boolean, {
    description: '是否默认',
  })
  isDefault: boolean;
}
