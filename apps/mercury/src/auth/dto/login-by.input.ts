// nest
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginBy {
  @Field(() => String, {
    description: '用户关键字',
  })
  keyword: string;

  @Field(() => String, {
    description: '密码',
  })
  password: string;
}
