import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { FilterTransactionsInput } from './dto/filter-transactions.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { Transaction } from '@/libs/database/entities/venus/transaction.entity';
import { paginateQuery } from 'utils/query-builder';
import { FilterTransactionsAmountInput } from './dto/filter-transactions-amount.input';
import { Query } from 'typings/controller';
import { TransactionsAmount } from './dto/transactions-amount.object';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * @author murukal
   * @description 创建交易
   */
  create(input: CreateTransactionInput, createdById: number) {
    return this.transactionRepository.save(
      this.transactionRepository.create({
        ...input,
        createdById,
      }),
    );
  }

  /**
   * @author murukal
   * @description 查询交易列表
   */
  transactions({ filter, ..._query }: Query<FilterTransactionsInput>) {
    const { categoryIds, happenedFrom, happenedTo, ..._filter } = filter || {};

    return paginateQuery(this.transactionRepository, {
      ..._query,
      filter: {
        ..._filter,
        ...(categoryIds && {
          categoryId: In(categoryIds),
        }),
        ...(happenedFrom && {
          happenedAt: MoreThanOrEqual(happenedFrom),
        }),
        ...(happenedTo && {
          happenedAt: LessThanOrEqual(happenedTo),
        }),
      },
      sort: {
        happenedAt: 'DESC',
        categoryId: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  /**
   * @author murukal
   * @description 根据`id`查询交易
   */
  transactionById(id: number) {
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .whereInIds(id)
      .getOne();
  }

  /**
   * @author murukal
   * @description 更新交易
   */
  async update(id: number, input: UpdateTransactionInput) {
    return !!(await this.transactionRepository.update(id, input)).affected;
  }

  /**
   * @author murukal
   * @description 删除交易
   */
  async remove(id: number) {
    return !!(await this.transactionRepository.delete(id)).affected;
  }

  /**
   * @author murukal
   * @description 获取分类下的总金额
   */
  async transactionsAmounts(filter: FilterTransactionsAmountInput) {
    const { billingId, categoryIds, happenedFrom, happenedTo } = filter;

    const qb = this.transactionRepository
      .createQueryBuilder()
      .select('categoryId')
      .addSelect('SUM(amount)', 'amount')
      .where({
        billingId,
      });

    // 圈定分类范围
    categoryIds &&
      qb.andWhere('categoryId IN (:...categoryIds)', {
        categoryIds,
      });

    // 交易发生起始时间
    happenedFrom &&
      qb.andWhere('happenedAt >= :happenedFrom', {
        happenedFrom,
      });

    // 交易发生截止时间
    happenedTo &&
      qb.andWhere('happenedAt <= :happenedTo', {
        happenedTo,
      });

    return (await qb.groupBy('categoryId').execute()) as TransactionsAmount[];
  }
}
