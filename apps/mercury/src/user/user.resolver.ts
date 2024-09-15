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
import { JwtAuthGuard } from '@/lib/passport/guards';
import { WhoAmI } from 'assets/decorators';
import { SendCaptchaBy } from './dto/send-captcha-by.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UpdateUserBy } from './dto/update-user-by.input';

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
  sendCaptcha(@Args('sendBy') sendBy: SendCaptchaBy) {
    return this.userService.sendCaptcha(sendBy);
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

  @Mutation(() => Boolean, {
    description: '更新用户信息',
  })
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @WhoAmI() whoAmI: User,
    @Args('updateBy') updateBy: UpdateUserBy,
  ) {
    return await this.userService.updateUser(whoAmI.id, updateBy);
  }

  @ResolveReference()
  async getUser(reference: { __typename: string; id: number }) {
    return await this.userService.getUser(reference.id);
  }
}
