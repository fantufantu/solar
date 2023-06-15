// nest
import { Injectable } from '@nestjs/common';
// third
import DataLoader = require('dataloader');
// project
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { Billing } from '../billing/entities/billing.entity';
import { BillingService } from '../billing/billing.service';

@Injectable()
export class TransactionLoader {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly billingService: BillingService,
  ) {}

  /**
   * @author murukal
   * @description 根据分类 id 获取分类信息
   */
  readonly categoryLoader = new DataLoader<number, Category | null>(
    async (ids: number[]) => {
      const [categories] = await this.categoryService.getCategories({
        filterBy: {
          ids,
        },
      });

      return ids.map(
        (id) => categories.find((category) => category.id === id) || null,
      );
    },
  );

  /**
   * @author murukal
   * @description 根据账本 id 获取账本
   */
  readonly billingLoader = new DataLoader<number, Billing | null>(
    async (ids: number[]) => {
      const billings = await this.billingService.getBillingsByIds(ids);

      return ids.map(
        (id) => billings.find((billing) => billing.id === id) || null,
      );
    },
  );
}
