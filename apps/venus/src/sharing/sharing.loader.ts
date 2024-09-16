import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { User } from '@/lib/database/entities/venus/user.entity';

@Injectable()
export class SharingLoader {
  /**
   * @description
   * 根据用户id获取用户信息
   */
  public readonly getUserById = new DataLoader<number, User>(
    async (_userIds: number[]) => {
      return [];
    },
  );
}
