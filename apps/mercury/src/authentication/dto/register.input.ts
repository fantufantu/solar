import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '@/libs/database/entities/mercury/user.entity';

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
  username?: string;

  @Field(() => String, {
    description: '密码',
    nullable: true,
  })
  password?: string;

  @Field(() => String, {
    description: '验证码',
  })
  captcha: string;
}
