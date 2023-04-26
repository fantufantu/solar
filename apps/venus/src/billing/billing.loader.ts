// nest
import { Injectable } from '@nestjs/common';
// third
import DataLoader = require('dataloader');
// project
import { Sharing, TargetType } from '../sharing/entities/sharing.entity';
import { SharingService } from '../sharing/sharing.service';

@Injectable()
export class BillingLoader {
  constructor(private readonly sharingService: SharingService) {}

  /**
   * 根据账本 id 获取分享信息
   */
  public readonly getSharingsByBillingId = new DataLoader<number, Sharing[]>(
    async (billingIds: number[]) => {
      // 查询分享列表
      const sharings = await this.sharingService.getSharings({
        targetType: TargetType.Billing,
        targetIds: billingIds,
      });

      // 按账本 id 归类
      const groupedSharings = sharings.reduce((prev, sharing) => {
        if (!prev.has(sharing.targetId)) {
          return prev.set(sharing.targetId, [sharing]);
        }

        prev.get(sharing.targetId)!.push(sharing);
        return prev;
      }, new Map<number, Sharing[]>());

      return billingIds.map(
        (billingId) => groupedSharings.get(billingId) || [],
      );
    },
    {
      cache: false,
    },
  );
}
