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
   * 根据分类 id 获取总金额
   */
  public readonly getAmountGroupedByCategory = new DataLoader<number, number>(
    async (categoryIds: number[]) => {
      const from = new Date();
      const to = new Date();

      const amounts = await this.transactionService.getAmountGroupedByCategory({
        categoryIds,
        from,
        to,
      });

      return categoryIds.map(
        (categoryId) =>
          amounts.find((totalExpense) => totalExpense.categoryId === categoryId)
            ?.amount ?? 0,
      );
    },
    { cache: false },
  );
}
