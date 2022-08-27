import { User } from '@app/data-base/entities/boomemory';
import { Field, InputType, PickType } from '@nestjs/graphql';

@InputType()
export class RegisterInput extends PickType(
  User,
  ['avatar', 'emailAddress'],
  InputType,
) {
  @Field(() => String, {
    description: '用户名',
    nullable: true,
  })
  username: string;

  @Field(() => String, {
    description: '密码',
  })
  password: string;

  @Field(() => String, {
    description: '验证码',
  })
  captcha: string;
}
