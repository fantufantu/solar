// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { In, Repository } from 'typeorm';
// project
import { CreateTransactionInput } from './dto/create-transaction.input';
import { FilterTransactionArgs } from './dto/filter-transaction.args';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { Direction, Transaction } from './entities/transaction.entity';
import { paginateQuery } from 'utils/api';
import { GroupedExpense, GroupExpenseArgs } from './dto/group-expense.args';
import { QueryParameters } from 'typings/api';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * 创建交易
   * @param createTransactionInput
   * @param createdById
   * @returns
   */
  create(createTransactionInput: CreateTransactionInput, createdById: number) {
    return this.transactionRepository.save(
      this.transactionRepository.create({
        ...createTransactionInput,
        createdById,
      }),
    );
  }

  /**
   * 查询交易列表
   * @param queryArgs
   * @returns
   */
  getTransactions(queryArgs?: QueryParameters<FilterTransactionArgs>) {
    const { filterArgs, ...otherQueryArgs } = queryArgs;
    const { directions, ...otherFilterArgs } = filterArgs;

    return paginateQuery(this.transactionRepository, {
      ...otherQueryArgs,
      filterArgs: {
        ...otherFilterArgs,
        direction: In(directions),
      },
      sortArgs: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * 查询交易
   * @param id
   * @returns
   */
  getTransaction(id: number) {
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
    return (
      (await this.transactionRepository.update(id, updateTransactionInput))
        .affected > 0
    );
  }

  /**
   * 删除交易
   * @param id
   * @returns
   */
  async remove(id: number) {
    return (await this.transactionRepository.delete(id)).affected > 0;
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
