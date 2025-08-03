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
import { TransactionService } from './transaction.service';
import { Transaction } from '@/libs/database/entities/venus/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { TransactionLoader } from './transaction.loader';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { FilterTransactionsInput } from './dto/filter-transactions.input';
import { Pagination } from 'assets/dto/pagination.input';
import { Category } from '@/libs/database/entities/venus/category.entity';
import { User } from '@/libs/database/entities/venus/user.entity';
import { PaginatedTransactions } from './dto/paginated-transactions.object';
import { PaginatedInterceptor } from 'assets/interceptors/paginated.interceptor';
import { Billing } from '@/libs/database/entities/venus/billing.entity';
import { TransactionsAmount } from './dto/transactions-amount.object';
import { FilterTransactionsAmountInput } from './dto/filter-transactions-amount.input';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { FilterArgs } from 'utils/decorators/filter.decorator';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';

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
    @Args('input', {
      description: '交易',
    })
    input: CreateTransactionInput,
    @WhoAmI() whoAmI: User,
  ) {
    return this.transactionService.create(input, whoAmI.id);
  }

  @Query(() => PaginatedTransactions, {
    name: 'transactions',
    description: '分页查询交易',
  })
  @UseInterceptors(PaginatedInterceptor)
  @UseGuards(JwtAuthGuard)
  getTransactions(
    @FilterArgs({
      type: () => FilterTransactionsInput,
      nullable: false,
    })
    filter: FilterTransactionsInput,
    @PaginationArgs() pagination: Pagination,
  ) {
    return this.transactionService.transactions({
      filter,
      pagination,
    });
  }

  @Query(() => Transaction, {
    name: 'transaction',
    description: '根据id查询交易',
  })
  @UseGuards(JwtAuthGuard)
  getTransactionById(
    @Args('id', { type: () => Int, description: '交易id' }) id: number,
  ) {
    return this.transactionService.transactionById(id);
  }

  @Mutation(() => Boolean, {
    description: '更新交易',
  })
  updateTransaction(
    @Args('id', { type: () => Int, description: '交易id' }) id: number,
    @Args('input', { description: '交易' })
    input: UpdateTransactionInput,
  ) {
    return this.transactionService.update(id, input);
  }

  @Mutation(() => Boolean)
  removeTransaction(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.remove(id);
  }

  @Query(() => [TransactionsAmount], {
    description: '按交易类别计算金额总和',
  })
  async transactionsAmounts(
    @Args('filter', { description: '过滤参数' })
    filter: FilterTransactionsAmountInput,
  ) {
    return await this.transactionService.transactionsAmounts(filter);
  }

  @ResolveField('category', () => Category, {
    description: '分类',
  })
  getCategory(@Parent() transaction: Transaction) {
    return this.transactionLoader.categoryLoader.load(transaction.categoryId);
  }

  @ResolveField('createdBy', () => User, {
    description: '交易创建人',
  })
  getCreatedBy(@Parent() transaction: Transaction) {
    return { __typename: User.name, id: transaction.createdById };
  }

  @ResolveField('billing', () => Billing, {
    description: '账本',
  })
  getBilling(@Parent() transaction: Transaction) {
    return this.transactionLoader.billingLoader.load(transaction.billingId);
  }
}
