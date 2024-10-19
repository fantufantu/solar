import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { WhoAmI } from 'assets/decorators';
import { Billing } from '@/libs/database/entities/venus/billing.entity';
import { SetDefaultBillingBy } from './dto/set-default-billing-by.input';
import { User } from '@/libs/database/entities/venus/user.entity';
import { UserLoader } from './user.loader';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@/libs/passport/guards';

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
  setDefaultBilling(
    @Args('setBy') setBy: SetDefaultBillingBy,
    @WhoAmI() whoAmI: User,
  ) {
    return this.userService.setDefaultBilling(setBy, whoAmI.id);
  }

  @ResolveField('defaultBilling', () => Billing, {
    description: '默认账本',
    nullable: true,
  })
  getDefaultBilling(@Parent() user: User) {
    if (!user.defaultBillingId) return null;
    return this.userLoader.getBillingById.load(user.defaultBillingId);
  }

  @ResolveReference()
  getUser(reference: { __typename: string; id: number }) {
    return this.userService.getUserById(reference.id);
  }
}
