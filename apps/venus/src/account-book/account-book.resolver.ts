import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AccountBookService } from './account-book.service';
import { AccountBook } from './entities/account-book.entity';
import { CreateAccountBookInput } from './dto/create-account-book.input';
import { UpdateAccountBookInput } from './dto/update-account-book.input';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '@app/passport/guards';
import { CurrentUser } from 'assets/decorators';
import { User } from 'apps/mercury/src/auth/entities/user.entity';
import { SetDefaultArgs } from './dto/set-default.args';

@Resolver(() => AccountBook)
export class AccountBookResolver {
  constructor(private readonly accountBookService: AccountBookService) {}

  @Mutation(() => AccountBook, {
    description: '创建账本',
  })
  @UseGuards(JwtAuthGuard)
  // @UseInterceptors(ShareInterceptor)
  createBilling(
    @Args('createAccountBookInput')
    createAccountBookInput: CreateAccountBookInput,
    @CurrentUser() user: User,
  ) {
    return this.accountBookService.create(createAccountBookInput, user.id);
  }

  @Query(() => [AccountBook], {
    name: 'accountBooks',
    description: '查询多个账本',
  })
  @UseGuards(new JwtAuthGuard(true))
  // @UseInterceptors(ShareInterceptor)
  getAccountBooks(@CurrentUser() user: User) {
    return this.accountBookService.getAccountBooks(user.id);
  }

  @Query(() => AccountBook, {
    name: 'accountBook',
    description: '查询单个账本',
    nullable: true,
  })
  @UseGuards(new JwtAuthGuard(true))
  // @UseInterceptors(ShareInterceptor)
  getAccountBook(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.accountBookService.getAccountBook(id, user.id);
  }

  @Mutation(() => Boolean, {
    description: '更新账本',
  })
  updateAccountBook(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @Args('updateAccountBookInput')
    updateAccountBookInput: UpdateAccountBookInput,
  ) {
    return this.accountBookService.update(id, updateAccountBookInput);
  }

  @Mutation(() => Boolean, {
    description: '删除账本',
  })
  @UseGuards(JwtAuthGuard)
  removeAccountBook(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.accountBookService.remove(id, user.id);
  }

  @Mutation(() => Boolean, {
    description: '设置账本为默认账本',
  })
  @UseGuards(JwtAuthGuard)
  setDefault(
    @Args() setDefaultArgs: SetDefaultArgs,
    @CurrentUser() user: User,
  ) {
    return this.accountBookService.switchDefault(setDefaultArgs, user.id);
  }

  @ResolveField('shares', () => [Share], {
    description: '分享',
    nullable: true,
  })
  getShares(@Parent() billing: Billing) {
    return this.billingLoader.getSharesByTargetId.load(billing.id);
  }

  @ResolveField('createdBy', () => User, {
    description: '创建人',
    nullable: true,
  })
  getCreatedBy(@Parent() billing: Billing) {
    return this.billingLoader.getUserById.load(billing.createdById);
  }
}
