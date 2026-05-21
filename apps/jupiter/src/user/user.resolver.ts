import { Args, Mutation, Resolver, ResolveReference } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '@/libs/database/entities/jupiter/user.entity';
import { UpgradeMembershipInput } from './dto/upgrade-membership.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveReference()
  user(reference: { __typename: string; id: number }) {
    return this.userService.user(reference.id);
  }

  @Mutation(() => Boolean, { description: '升级用户会员等级' })
  upgradeMembership(
    @Args('input') input: UpgradeMembershipInput,
  ) {
    return this.userService.upgradeMembership(input.userId, input.membershipId);
  }
}
