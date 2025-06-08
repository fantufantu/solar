import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CreateTransactionBy } from './dto/create-transaction-by.input';
import { FilterTransactionsBy } from './dto/filter-transactions-by.input';
import { UpdateTransactionBy } from './dto/update-transaction-by.input';
import { Transaction } from '@/libs/database/entities/venus/transaction.entity';
import { paginateQuery } from 'utils/query-builder';
import { GroupTransactionAmountByCategory } from './dto/group-transaction-amount-by-category.input';
import { QueryBy } from 'typings/controller';
import { TransactionAmountGroupedByCategory } from './dto/transaction-amount-grouped-by-category';

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
  create(createTransactionBy: CreateTransactionBy, createdById: number) {
    return this.transactionRepository.save(
      this.transactionRepository.create({
        ...createTransactionBy,
        createdById,
      }),
    );
  }

  /**
   * @author murukal
   * @description
   * 查询交易列表
   */
  getTransactions({ filterBy, ..._queryBy }: QueryBy<FilterTransactionsBy>) {
    const { categoryIds, happenedFrom, happenedTo, ..._filterBy } =
      filterBy || {};

    return paginateQuery(this.transactionRepository, {
      ..._queryBy,
      filterBy: {
        ..._filterBy,
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
      sortBy: {
        happenedAt: 'DESC',
        categoryId: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  /**
   * @author murukal
   * @description 根据 id 查询交易
   */
  getTransactionById(id: number) {
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .whereInIds(id)
      .getOne();
  }

  /**
   * @author murukal
   * @description 更新交易
   */
  async update(id: number, updateTransactionBy: UpdateTransactionBy) {
    return !!(await this.transactionRepository.update(id, updateTransactionBy))
      .affected;
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
  async getTransactionAmountsGroupedByCategory(
    groupBy: GroupTransactionAmountByCategory,
  ) {
    const { billingId, categoryIds, happenedFrom, happenedTo } = groupBy;

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

    return (await qb
      .groupBy('categoryId')
      .execute()) as TransactionAmountGroupedByCategory[];
  }
}
