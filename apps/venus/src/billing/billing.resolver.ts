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
import { BillingService } from './billing.service';
import { Billing } from '@/libs/database/entities/venus/billing.entity';
import { CreateBillingInput } from './dto/create-billing.input';
import { UpdateBillingInput } from './dto/update-billing.input';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { Sharing } from '@/libs/database/entities/venus/sharing.entity';
import { BillingLoader } from './billing.loader';
import { User } from '@/libs/database/entities/venus/user.entity';
import { PaginatedInterceptor } from 'assets/interceptors/paginated.interceptor';
import { PaginatedBillings } from './dto/paginated-billings.object';
import { UpdateBillingLimitationInput } from './dto/update-billing-limitation.input';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';

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
    @Args('input')
    input: CreateBillingInput,
    @WhoAmI() whoAmI: User,
  ) {
    return this.billingService.create(input, whoAmI.id);
  }

  @Query(() => PaginatedBillings, {
    description: '查询账本列表',
  })
  @UseInterceptors(PaginatedInterceptor)
  @UseGuards(JwtAuthGuard)
  billings(@WhoAmI() who: User) {
    return this.billingService.billings({ who: who.id });
  }

  @Query(() => Billing, {
    description: '查询账本',
    nullable: true,
  })
  @UseGuards(JwtAuthGuard)
  billing(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @WhoAmI() whoAmI: User,
  ) {
    return this.billingService.billing(id, whoAmI.id);
  }

  @Mutation(() => Boolean, {
    description: '更新账本',
  })
  @UseGuards(JwtAuthGuard)
  updateBilling(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @Args('input')
    input: UpdateBillingInput,
  ) {
    return this.billingService.update(id, input);
  }

  @Mutation(() => Boolean, {
    description: '删除账本',
  })
  @UseGuards(JwtAuthGuard)
  removeBilling(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @WhoAmI() whoAmI: User,
  ) {
    return this.billingService.remove(id, whoAmI.id);
  }

  @Mutation(() => Boolean, {
    description: '设置限额',
  })
  @UseGuards(JwtAuthGuard)
  updateBillingLimitation(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @Args('input')
    input: UpdateBillingLimitationInput,
  ) {
    return this.billingService.updateLimitation(id, input);
  }

  @ResolveField(() => [Sharing], {
    description: '分享',
    nullable: true,
  })
  sharings(@Parent() billing: Billing) {
    return this.billingLoader.sharings.load(billing.id);
  }

  @ResolveField(() => User, {
    description: '创建人',
    nullable: true,
  })
  async createdBy(@Parent() billing: Billing) {
    return { __typename: User.name, id: billing.createdById };
  }
}
