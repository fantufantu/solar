import {
  Args,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '@/libs/database/entities/jupiter/user.entity';
import { UpgradeMembershipInput } from './dto/upgrade-membership.input';
import { UserMembership } from './dto/user-membership.object';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveReference()
  user(reference: { __typename: string; id: string }) {
    return this.userService.user(reference.id);
  }

  @ResolveField(() => UserMembership, {
    description: '用户会员等级',
  })
  async membership(@Parent() user: User) {
    return await this.userService.membership(user.id);
  }

  @ResolveField(() => Int, {
    description: '用户已使用额度',
  })
  async usedQuota(@Parent() user: User): Promise<number> {
    return this.userService.usedQuota(user.id);
  }

  @Mutation(() => Boolean, { description: '升级用户会员等级' })
  upgradeMembership(@Args('input') input: UpgradeMembershipInput) {
    return this.userService.upgradeMembership(input.userId, input.membershipId);
  }
}
