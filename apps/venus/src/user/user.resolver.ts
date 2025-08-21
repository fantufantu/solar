import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { Billing } from '@/libs/database/entities/venus/billing.entity';
import { UpdateDefaultBillingInput } from './dto/update-default-billing.input';
import { User } from '@/libs/database/entities/venus/user.entity';
import { UserLoader } from './user.loader';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userLoader: UserLoader,
  ) {}

  @Mutation(() => Boolean, {
    description: '设置默认账本',
  })
  @UseGuards(JwtAuthGuard)
  updateDefaultBilling(
    @Args('input') input: UpdateDefaultBillingInput,
    @WhoAmI() whoAmI: User,
  ) {
    return this.userService.updateDefaultBilling(input, whoAmI.id);
  }

  @ResolveField(() => Billing, {
    description: '默认账本',
    nullable: true,
  })
  defaultBilling(@Parent() user: User) {
    if (!user.defaultBillingId) return null;
    return this.userLoader.billings.load(user.defaultBillingId);
  }

  @ResolveReference()
  user(reference: { __typename: string; id: number }) {
    return this.userService.user(reference.id);
  }
}
