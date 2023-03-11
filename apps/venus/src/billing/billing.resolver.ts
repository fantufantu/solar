// nest
import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
// project
import { BillingService } from './billing.service';
import { Billing } from './entities/billing.entity';
import { CreateBillingInput } from './dto/create-billing.input';
import { UpdateBillingInput } from './dto/update-billing.input';
import { JwtAuthGuard } from '@app/passport/guards';
import { WhoAmI } from 'assets/decorators';
import { Sharing } from '../sharing/entities/sharing.entity';
import { BillingLoader } from './billing.loader';
import { User } from '../user/entities/user.entity';

@Resolver(() => Billing)
export class BillingResolver {
  constructor(
    private readonly billingService: BillingService,
    private readonly billingLoader: BillingLoader,
  ) {}

  @Mutation(() => Billing, {
    description: '创建账本',
  })
  @UseGuards(JwtAuthGuard)
  createBilling(
    @Args('createBillingInput')
    createBillingInput: CreateBillingInput,
    @WhoAmI() user: User,
  ) {
    return this.billingService.create(createBillingInput, user.id);
  }

  @Query(() => [Billing], {
    name: 'billings',
    description: '查询账本列表',
  })
  @UseGuards(JwtAuthGuard)
  getBillings(@WhoAmI() user: User) {
    return this.billingService.getBillingsByUserId(user.id);
  }

  @Query(() => Billing, {
    name: 'billing',
    description: '查询账本',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard)
  getBilling(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @WhoAmI() user: User,
  ) {
    return this.billingService.getBilling(id, user.id);
  }

  @Mutation(() => Boolean, {
    description: '更新账本',
  })
  @UseGuards(JwtAuthGuard)
  updateBilling(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @Args('updateBillingInput')
    updateBillingInput: UpdateBillingInput,
  ) {
    return this.billingService.update(id, updateBillingInput);
  }

  @Mutation(() => Boolean, {
    description: '删除账本',
  })
  @UseGuards(JwtAuthGuard)
  removeBilling(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @WhoAmI() user: User,
  ) {
    return this.billingService.remove(id, user.id);
  }

  @ResolveField('sharings', () => [Sharing], {
    description: '分享',
    nullable: true,
  })
  getSharings(@Parent() billing: Billing) {
    return this.billingLoader.getSharingsByBillingId.load(billing.id);
  }

  @ResolveField('createdBy', () => User, {
    description: '创建人',
    nullable: true,
  })
  getCreatedBy(@Parent() billing: Billing) {
    return this.billingLoader.getUserById.load(billing.createdById);
  }
}
