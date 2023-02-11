import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SendCaptchaArgs } from './dto/send-captcha.args';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Date, {
    description: '发送验证码',
    nullable: true,
  })
  sendCaptcha(@Args() sendCaptchaArgs: SendCaptchaArgs) {
    return null;
  }
}
