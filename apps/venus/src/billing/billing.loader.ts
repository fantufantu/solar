// nest
import { Injectable } from '@nestjs/common';
// third
import DataLoader = require('dataloader');
// project
import { Sharing, TargetType } from '../sharing/entities/sharing.entity';
import { SharingService } from '../sharing/sharing.service';
import { User } from '../user/entities/user.entity';
import { MercuryClientService } from '@app/mercury-client';

@Injectable()
export class BillingLoader {
  constructor(
    private readonly sharingService: SharingService,
    private readonly mercuryClient: MercuryClientService,
  ) {}

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

  /**
   * 根据创建者id获取账本创建人
   * @param ids 用户id列表
   * @returns
   */
  public getUserById = new DataLoader<number, User | null>(
    async (ids: number[]) => {
      const users = await this.mercuryClient.getUsersByIds(ids);
      return ids.map((id) => users.find((user) => user.id === id) ?? null);
    },
  );
}
