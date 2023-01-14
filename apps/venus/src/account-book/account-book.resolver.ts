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
import { AccountBookService } from './account-book.service';
import { AccountBook } from './entities/account-book.entity';
import { CreateAccountBookInput } from './dto/create-account-book.input';
import { UpdateAccountBookInput } from './dto/update-account-book.input';
import { JwtAuthGuard } from '@app/passport/guards';
import { CurrentUser } from 'assets/decorators';
import { User } from 'apps/mercury/src/auth/entities/user.entity';
import { SetDefaultArgs } from './dto/set-default.args';
import { Share } from '../share/entities/share.entity';
import { AccountBookLoader } from './account-book.loader';

@Resolver(() => AccountBook)
export class AccountBookResolver {
  constructor(
    private readonly accountBookService: AccountBookService,
    private readonly accountBookLoader: AccountBookLoader,
  ) {}

  @Mutation(() => AccountBook, {
    description: '创建账本',
  })
  @UseGuards(JwtAuthGuard)
  createAccountBook(
    @Args('createAccountBookInput')
    createAccountBookInput: CreateAccountBookInput,
    @CurrentUser() user: User,
  ) {
    return this.accountBookService.create(createAccountBookInput, user?.id);
  }

  @Query(() => [AccountBook], {
    name: 'accountBooks',
    description: '查询账本列表',
  })
  @UseGuards(new JwtAuthGuard(true))
  getAccountBooks(@CurrentUser() user: User) {
    return this.accountBookService.getAccountBooks(user.id);
  }

  @Query(() => AccountBook, {
    name: 'accountBook',
    description: '查询账本',
    nullable: true,
  })
  @UseGuards(new JwtAuthGuard(true))
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
    return this.accountBookService.setDefault(setDefaultArgs, user.id);
  }

  @ResolveField('shares', () => [Share], {
    description: '分享',
    nullable: true,
  })
  getShares(@Parent() accountBook: AccountBook) {
    return this.accountBookLoader.getSharesByAccountBookId.load(accountBook.id);
  }

  @ResolveField('createdBy', () => User, {
    description: '创建人',
    nullable: true,
  })
  getCreatedBy(@Parent() accountBook: AccountBook) {
    return this.accountBookLoader.getUserById.load(accountBook.createdById);
  }
}
