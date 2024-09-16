import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { BillingService } from '../billing/billing.service';
import { Billing } from '@/lib/database/entities/venus/billing.entity';

@Injectable()
export class UserLoader {
  constructor(private readonly billingService: BillingService) {}

  /**
   * 根据账本 id 获取账本信息
   */
  public readonly getBillingById = new DataLoader<number, Billing | null>(
    async (ids: number[]) => {
      // 查询账本列表
      const billings = await this.billingService.getBillingsByIds(ids);
      // id => 账本
      return ids.map(
        (id) => billings.find((billing) => billing.id === id) || null,
      );
    },
    {
      cache: false,
    },
  );
}
