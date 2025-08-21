import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  ResolveReference,
  Resolver,
} from '@nestjs/graphql';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { CacheToken } from 'assets/tokens';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, {
    description: '我是谁',
    nullable: true,
  })
  @UseGuards(new JwtAuthGuard(true))
  whoAmI(@WhoAmI() who: User | null) {
    return who;
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
    @Args('input') input: UpdateUserInput,
  ) {
    return await this.userService.updateUser(whoAmI.id, input);
  }

  @Mutation(() => Date, {
    description: '发送注册验证码',
  })
  sendRegisterCaptcha(@Args({ name: 'to', type: () => String }) to: string) {
    return this.userService.sendCaptcha(to, CacheToken.RegisterCaptcha);
  }

  @Mutation(() => Date, {
    description: '发送修改密码验证码',
    nullable: true,
  })
  sendChangePasswordCaptcha(
    @Args({ name: 'to', type: () => String }) to: string,
  ) {
    return this.userService.sendCaptcha(to, CacheToken.ChangePasswordCaptcha);
  }

  @ResolveReference()
  async user(reference: { __typename: string; id: number }) {
    return await this.userService.user(reference.id);
  }
}
