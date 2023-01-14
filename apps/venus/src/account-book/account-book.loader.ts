// nest
import { Injectable } from '@nestjs/common';
// third
import DataLoader = require('dataloader');
// project
import { Share, TargetType } from '../share/entities/share.entity';
import { User } from 'apps/mercury/src/auth/entities/user.entity';
import { ShareService } from '../share/share.service';

@Injectable()
export class AccountBookLoader {
  constructor(private readonly shareService: ShareService) {}

  /**
   * 根据账本 id 获取分享信息
   */
  public readonly getSharesByAccountBookId = new DataLoader<number, Share[]>(
    async (accountBookIds: number[]) => {
      // 查询分享列表
      const shares = await this.shareService.getShares({
        targetType: TargetType.AccountBook,
        targetIds: accountBookIds,
      });

      // 按账本 id 归类
      const groupedShares = shares.reduce((prev, share) => {
        return prev.set(
          share.targetId,
          (prev.get(share.targetId) || []).concat(share),
        );
      }, new Map<number, Share[]>());

      return accountBookIds.map((accountBookId) =>
        groupedShares.get(accountBookId),
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
  public getUserById = new DataLoader<number, User>(async () => {
    return [];
  });
}
