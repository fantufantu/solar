// nest
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  ResolveReference,
  Resolver,
} from '@nestjs/graphql';
// project
import { JwtAuthGuard } from '@app/passport/guards';
import { WhoAmI } from 'assets/decorators';
import { SendCaptchaBy } from './dto/send-captcha-by.input';
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
  sendCaptcha(@Args('sendCaptchaBy') sendCaptchaBy: SendCaptchaBy) {
    return this.userService.sendCaptcha(sendCaptchaBy);
  }

  @ResolveReference()
  async getUser(reference: { __typename: string; id: number }) {
    return await this.userService.getUser(reference.id);
  }
}
