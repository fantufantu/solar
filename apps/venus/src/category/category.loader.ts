// nest
import { Injectable } from '@nestjs/common';
// third
import DataLoader = require('dataloader');
// project
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class CategoryLoader {
  constructor(private readonly transactionService: TransactionService) {}

  /**
   * 根据分类 id 获取总支出
   */
  public readonly getExpenseGroupByCategory = new DataLoader<number, number>(
    async (categoryIds: number[]) => {
      const from = new Date();
      const to = new Date();

      const expenses = await this.transactionService.getExpensesGroupByCategory(
        {
          categoryIds,
          from,
          to,
        },
      );

      return categoryIds.map(
        (categoryId) =>
          expenses.find(
            (totalExpense) => totalExpense.categoryId === categoryId,
          )?.amount || 0,
      );
    },
    { cache: false },
  );
}
