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
import { Filter, Pagination, WhoAmI } from 'assets/decorators';
import { FilterTransactionBy } from './dto/filter-transaction.input';
import { PaginateBy } from 'assets/dto';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';
import { PaginatedTransactions } from './dto/pagineted-transactions';

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
    @Filter({
      type: () => FilterTransactionBy,
      nullable: false,
    })
    filterBy: FilterTransactionBy,
    @Pagination() paginateBy: PaginateBy,
  ) {
    return this.transactionService.getTransactions({
      filterBy,
      paginateBy,
    });
  }

  @Query(() => Transaction, {
    name: 'transaction',
    description: '根据 id 查询交易',
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
