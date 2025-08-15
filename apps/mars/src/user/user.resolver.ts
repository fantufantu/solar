import { Args, Mutation, Resolver, ResolveReference } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { User } from '@/libs/database/entities/mars/user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => [String], { description: '收藏简历模板' })
  async starResumeTemplate(
    @Args('code', { type: () => String }) code: string,
    @WhoAmI() who: User,
  ): Promise<string[]> {
    return (await this.userService.starResumeTemplate(code, who.id)) ?? [];
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => [String], { description: '取消收藏简历模板' })
  async unstarResumeTemplate(
    @Args('code', { type: () => String }) code: string,
    @WhoAmI() who: User,
  ): Promise<string[]> {
    return (await this.userService.unstarResumeTemplate(code, who.id)) ?? [];
  }

  @ResolveReference()
  user(reference: { __typename: string; id: number }) {
    return this.userService.user(reference.id);
  }
}
