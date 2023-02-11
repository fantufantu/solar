import { JwtAuthGuard } from '@app/passport/guards';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WhoAmI } from 'assets/decorators';
import { SendCaptchaArgs } from './dto/send-captcha.args';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, {
    description: '我是谁',
  })
  @UseGuards(JwtAuthGuard)
  whoAmI(@WhoAmI() user: User) {
    return user;
  }

  @Mutation(() => Date, {
    description: '发送验证码',
    nullable: true,
  })
  sendCaptcha(@Args() sendCaptchaArgs: SendCaptchaArgs) {
    return this.userService.sendCaptcha(sendCaptchaArgs);
  }
}
