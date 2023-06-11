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
    nullable: true,
  })
  @UseGuards(new JwtAuthGuard(true))
  whoAmI(@WhoAmI() user: User | null) {
    return user;
  }

  @Mutation(() => Date, {
    description: '发送验证码',
    nullable: true,
  })
  sendCaptcha(@Args('sendCaptchaBy') sendCaptchaBy: SendCaptchaBy) {
    return this.userService.sendCaptcha(sendCaptchaBy);
  }

  @Query(() => [User], {
    name: 'users',
    description: '利用账户信息查询账户列表',
  })
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @Args('who', { type: () => String, description: '账户信息' }) who: string,
    @WhoAmI() whoAmI: User,
  ) {
    return await this.userService.getUsersByWho(who, whoAmI.id);
  }

  @ResolveReference()
  async getUser(reference: { __typename: string; id: number }) {
    return await this.userService.getUser(reference.id);
  }
}
