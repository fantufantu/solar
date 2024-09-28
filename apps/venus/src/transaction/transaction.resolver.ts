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
import { Transaction } from '../../../../libs/database/src/entities/venus/transaction.entity';
import { CreateTransactionBy } from './dto/create-transaction-by.input';
import { UpdateTransactionBy } from './dto/update-transaction-by.input';
import { TransactionLoader } from './transaction.loader';
import { JwtAuthGuard } from '@/lib/passport/guards';
import { Filter, Pagination, WhoAmI } from 'assets/decorators';
import { FilterTransactionsBy } from './dto/filter-transactions-by.input';
import { PaginateBy } from 'assets/dto/paginate-by.input';
import { Category } from '../../../../libs/database/src/entities/venus/category.entity';
import { User } from '@/lib/database/entities/venus/user.entity';
import { PaginatedTransactions } from './dto/paginated-transactions.object';
import { PaginatedInterceptor } from 'assets/interceptor/paginated.interceptor';
import { Billing } from '@/lib/database/entities/venus/billing.entity';
import { TransactionAmountGroupedByCategory } from './dto/transaction-amount-grouped-by-category';
import { GroupTransactionAmountByCategory } from './dto/group-transaction-amount-by-category.input';

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
    @Args('createBy', {
      description: '交易',
    })
    createTransactionBy: CreateTransactionBy,
    @WhoAmI() user: User,
  ) {
    return this.transactionService.create(createTransactionBy, user.id);
  }

  @Query(() => PaginatedTransactions, {
    name: 'transactions',
    description: '分页查询交易',
  })
  @UseInterceptors(PaginatedInterceptor)
  @UseGuards(JwtAuthGuard)
  getTransactions(
    @Filter({
      type: () => FilterTransactionsBy,
      nullable: false,
    })
    filterBy: FilterTransactionsBy,
    @Pagination() paginateBy: PaginateBy,
  ) {
    return this.transactionService.getTransactions({
      filterBy,
      paginateBy,
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
    return this.transactionService.getTransactionById(id);
  }

  @Mutation(() => Boolean, {
    description: '更新交易',
  })
  updateTransaction(
    @Args('id', { type: () => Int, description: '交易id' }) id: number,
    @Args('updateBy', { description: '交易' })
    updateBy: UpdateTransactionBy,
  ) {
    return this.transactionService.update(id, updateBy);
  }

  @Mutation(() => Boolean)
  removeTransaction(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.remove(id);
  }

  @Query(() => [TransactionAmountGroupedByCategory], {
    name: 'transactionAmountsGroupedByCategory',
    description: '按交易类别计算金额总和',
  })
  async getTransactionAmountsGroupedByCategory(
    @Args('groupBy', { description: '分组' })
    groupBy: GroupTransactionAmountByCategory,
  ) {
    return await this.transactionService.getTransactionAmountsGroupedByCategory(
      groupBy,
    );
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
