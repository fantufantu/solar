// nest
import { Injectable } from '@nestjs/common';
// third
import DataLoader = require('dataloader');
// project
import { BillingService } from '../billing/billing.service';
import { Billing } from '../billing/entities/billing.entity';

@Injectable()
export class UserLoader {
  constructor(private readonly billingService: BillingService) {}

  /**
   * 根据账本 id 获取账本信息
   */
  public readonly getBillingById = new DataLoader<number, Billing>(
    async (ids: number[]) => {
      // 查询账本列表
      const billings = await this.billingService.getBillingsByIds(ids);
      // id => 账本
      return ids.map((id) => billings.find((billing) => billing.id === id));
    },
    {
      cache: false,
    },
  );
}
