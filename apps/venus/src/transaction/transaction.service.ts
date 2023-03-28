// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { In, Repository } from 'typeorm';
// project
import { CreateTransactionBy } from './dto/create-transaction-by.input';
import { FilterTransactionBy } from './dto/filter-transaction-by.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { Direction, Transaction } from './entities/transaction.entity';
import { paginateQuery } from 'utils/api';
import { GroupedExpense, GroupExpenseArgs } from './dto/group-expense.args';
import { QueryBy } from 'typings/api';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * 创建交易
   */
  create(createTransactionBy: CreateTransactionBy, createdById: number) {
    return this.transactionRepository.save(
      this.transactionRepository.create({
        ...createTransactionBy,
        createdById,
      }),
    );
  }

  /**
   * 查询交易列表
   */
  getTransactions(queryBy: QueryBy<FilterTransactionBy>) {
    const { filterBy, ...queryByWithout } = queryBy;
    const { directions = [], ...filterByWithout } = filterBy || {};

    return paginateQuery(this.transactionRepository, {
      ...queryByWithout,
      filterBy: {
        ...filterByWithout,
        direction: In(directions),
      },
      sortBy: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * 根据 id 查询交易
   * @param id
   * @returns
   */
  getTransactionById(id: number) {
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .whereInIds(id)
      .getOne();
  }

  /**
   * 更新交易
   * @param id
   * @param updateTransactionInput
   * @returns
   */
  async update(id: number, updateTransactionInput: UpdateTransactionInput) {
    return !!(
      await this.transactionRepository.update(id, updateTransactionInput)
    ).affected;
  }

  /**
   * 删除交易
   * @param id
   * @returns
   */
  async remove(id: number) {
    return !!(await this.transactionRepository.delete(id)).affected;
  }

  /**
   * 获取分类下的总支出列表
   * @param args
   * @returns
   */
  async getExpensesGroupByCategory(args: GroupExpenseArgs) {
    return (await this.transactionRepository
      .createQueryBuilder()
      .select('categoryId')
      .addSelect('SUM(amount)', 'amount')
      .where('categoryId IN (:...categoryIds)', {
        categoryIds: args.categoryIds,
      })
      .andWhere('direction = :direction', {
        direction: Direction.Out,
      })
      .andWhere('createdAt >= :from', {
        from: args.from,
      })
      .andWhere('createdAt <= :to', {
        to: args.to,
      })
      .groupBy('categoryId')
      .execute()) as GroupedExpense[];
  }
}
