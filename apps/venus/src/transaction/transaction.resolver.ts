// nest
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
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { TransactionLoader } from './transaction.loader';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/passport/guards';
import { Pagination, WhoAmI } from 'assets/decorators';
import { User } from 'apps/mercury/src/auth/entities/user.entity';
import {
  FilterTransactionArgs,
  PaginatedTransactions,
} from './dto/filter-transaction.args';
import { PaginateArgs } from 'assets/dtos';
import { Category } from '../category/entities/category.entity';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionLoader: TransactionLoader,
  ) {}

  @Mutation(() => Transaction, {
    description: '创建交易',
  })
  @UseGuards(JwtAuthGuard)
  createTransaction(
    @Args('createTransactionInput', {
      description: '交易',
    })
    createTransactionInput: CreateTransactionInput,
    @WhoAmI() user: User,
  ) {
    return this.transactionService.create(createTransactionInput, user.id);
  }

  @Query(() => PaginatedTransactions, {
    name: 'transactions',
    description: '分页查询交易',
  })
  @UseGuards(JwtAuthGuard)
  getTransactions(
    @Args('filter', {
      type: () => FilterTransactionArgs,
      description: '查询交易筛选条件',
    })
    filterArgs: FilterTransactionArgs,
    @Pagination() paginateArgs: PaginateArgs,
  ) {
    return this.transactionService.getTransactions({
      filterArgs,
      paginateArgs,
    });
  }

  @Query(() => Transaction, {
    name: 'transaction',
    description: '查询单个交易',
  })
  @UseGuards(JwtAuthGuard)
  getTransaction(
    @Args('id', { type: () => Int, description: '交易id' }) id: number,
  ) {
    return this.transactionService.getTransaction(id);
  }

  @Mutation(() => Boolean, {
    description: '更新交易',
  })
  updateTransaction(
    @Args('id', { type: () => Int, description: '交易id' }) id: number,
    @Args('updateTransactionInput', { description: '交易' })
    updateTransactionInput: UpdateTransactionInput,
  ) {
    return this.transactionService.update(id, updateTransactionInput);
  }

  @Mutation(() => Boolean)
  removeTransaction(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.remove(id);
  }

  @ResolveField('category', () => Category, {
    description: '分类',
  })
  getCategory(@Parent() transaction: Transaction) {
    return this.transactionLoader.getCategoryById.load(transaction.categoryId);
  }

  @ResolveField('createdBy', () => User, {
    description: '交易创建人',
  })
  getCreatedBy(@Parent() transaction: Transaction) {
    return this.transactionLoader.getUserById.load(transaction.createdById);
  }
}
