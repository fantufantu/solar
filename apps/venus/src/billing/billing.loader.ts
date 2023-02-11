// nest
import { Injectable } from '@nestjs/common';
// third
import DataLoader = require('dataloader');
// project
import { Share, TargetType } from '../share/entities/share.entity';
import { User } from 'apps/mercury/src/auth/entities/user.entity';
import { ShareService } from '../share/share.service';

@Injectable()
export class BillingLoader {
  constructor(private readonly shareService: ShareService) {}

  /**
   * 根据账本 id 获取分享信息
   */
  public readonly getSharesByBillingId = new DataLoader<number, Share[]>(
    async (billingIds: number[]) => {
      // 查询分享列表
      const shares = await this.shareService.getShares({
        targetType: TargetType.Billing,
        targetIds: billingIds,
      });

      // 按账本 id 归类
      const groupedShares = shares.reduce((prev, share) => {
        return prev.set(
          share.targetId,
          (prev.get(share.targetId) || []).concat(share),
        );
      }, new Map<number, Share[]>());

      return billingIds.map((billingId) => groupedShares.get(billingId));
    },
    {
      cache: false,
    },
  );

  /**
   * 根据创建者id获取账本创建人
   * @param ids 用户id列表
   * @returns
   */
  public getUserById = new DataLoader<number, User>(async () => {
    return [];
  });
}
