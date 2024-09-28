import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginBy {
  @Field(() => String, {
    description: '用户凭证',
  })
  who: string;

  @Field(() => String, {
    description: '密码',
  })
  password: string;
}
