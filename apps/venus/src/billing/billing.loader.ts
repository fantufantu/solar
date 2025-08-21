import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import {
  Sharing,
  TargetType,
} from '@/libs/database/entities/venus/sharing.entity';
import { SharingService } from '../sharing/sharing.service';

@Injectable()
export class BillingLoader {
  constructor(private readonly sharingService: SharingService) {}

  /**
   * @description
   * 根据账本`id`获取分享信息
   */
  public readonly sharings = new DataLoader<number, Sharing[]>(
    async (billingIds: number[]) => {
      // 查询分享列表
      const sharings = await this.sharingService.sharings({
        targetType: TargetType.Billing,
        targetIds: billingIds,
      });

      // 按账本`id`归类
      const groupedSharings = sharings.reduce((prev, sharing) => {
        const _sharings = prev.get(sharing.targetId) ?? [];
        _sharings.push(sharing);
        return prev.set(sharing.targetId, _sharings);
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
