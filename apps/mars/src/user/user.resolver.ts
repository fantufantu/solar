import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { User } from '@/libs/database/entities/mercury/user.entity';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { description: '收藏简历模板' })
  starResumeTemplate(
    @Args('code', { type: () => String }) code: string,
    @WhoAmI() who: User,
  ) {
    return this.userService.starResumeTemplate(code, who.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { description: '取消收藏简历模板' })
  unstarResumeTemplate(
    @Args('code', { type: () => String }) code: string,
    @WhoAmI() who: User,
  ) {
    return this.userService.unstarResumeTemplate(code, who.id);
  }
}
