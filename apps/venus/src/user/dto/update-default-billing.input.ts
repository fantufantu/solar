import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateDefaultBillingInput {
  @Field(() => Int, {
    description: '账本`id`',
  })
  id: number;

  @Field(() => Boolean, {
    description: '是否默认',
  })
  isDefault: boolean;
}
