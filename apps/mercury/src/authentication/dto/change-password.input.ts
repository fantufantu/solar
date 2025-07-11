import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangePasswordInput {
  @Field(() => String, {
    description: '用户名/邮箱',
  })
  who: string;

  @Field(() => String, {
    description: '验证码',
  })
  captcha: string;

  @Field(() => String, {
    description: '密码',
  })
  password: string;
}
