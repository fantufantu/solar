// nest
import { UseGuards, UseInterceptors } from '@nestjs/common';
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
import { CreateBillingBy } from './dto/create-billing-by.input';
import { UpdateBillingBy } from './dto/update-billing-by.input';
import { JwtAuthGuard } from '@app/passport/guards';
import { WhoAmI } from 'assets/decorators';
import { Sharing } from '../sharing/entities/sharing.entity';
import { BillingLoader } from './billing.loader';
import { User } from '../user/entities/user.entity';
import { PaginatedInterceptor } from 'assets/interceptor/paginated.interceptor';
import { PaginatedBillings } from './dto/paginated-billings';
import { SetBillingLimitBy } from './dto/set-billing-limit-by.input';

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
    @Args('createBy')
    createBillingBy: CreateBillingBy,
    @WhoAmI() user: User,
  ) {
    return this.billingService.create(createBillingBy, user.id);
  }

  @Query(() => PaginatedBillings, {
    name: 'billings',
    description: '查询账本列表',
  })
  @UseInterceptors(PaginatedInterceptor)
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
    @Args('updateBy')
    updateBy: UpdateBillingBy,
  ) {
    return this.billingService.update(id, updateBy);
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

  @Mutation(() => Boolean, {
    description: '设置限额',
  })
  @UseGuards(JwtAuthGuard)
  setBillingLimit(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @Args('setBy')
    setBy: SetBillingLimitBy,
  ) {
    return this.billingService.setLimit(id, setBy);
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
  async getCreatedBy(@Parent() billing: Billing) {
    return { __typename: User.name, id: billing.createdById };
  }
}
