// nest
import { JwtAuthGuard } from '@app/passport/guards';
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
import { Billing } from '../billing/entities/billing.entity';
import { SetDefaultArgs } from './dto/set-default.args';
import { User } from './entities/user.entity';
import { UserLoader } from './user.loader';
import { UserService } from './user.service';

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
  setDefault(@Args() setDefaultArgs: SetDefaultArgs, @WhoAmI() user: User) {
    return this.userService.setDefault(setDefaultArgs, user.id);
  }

  @ResolveReference()
  getUser(reference: { __typename: string; id: number }) {
    return this.userService.getUserById(reference.id);
  }

  @ResolveField('defaultBilling', () => Billing, {
    description: '默认账本',
    nullable: true,
  })
  getDefaultBilling(@Parent() user: User) {
    return this.userLoader.getBillingById.load(user.defaultBillingId);
  }
}
