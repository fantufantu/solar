import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { BillingService } from '../billing/billing.service';
import { Billing } from '@/libs/database/entities/venus/billing.entity';

@Injectable()
export class UserLoader {
  constructor(private readonly billingService: BillingService) {}

  /**
   * @description 根据账本`id`获取账本信息
   */
  public readonly billings = new DataLoader<number, Billing | null>(
    async (ids: number[]) => {
      // 查询账本列表
      const _billings = (await this.billingService.billings(ids)).reduce(
        (prev, _billing) => prev.set(_billing.id, _billing),
        new Map<number, Billing>(),
      );
      return ids.map((id) => _billings.get(id) ?? null);
    },
    {
      cache: false,
    },
  );
}
