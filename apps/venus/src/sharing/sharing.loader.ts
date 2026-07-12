import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { User } from '@/libs/database/entities/venus/user.entity';

@Injectable()
export class SharingLoader {
  /**
   * @description
   * 根据用户id获取用户信息
   */
  public readonly getUserById = new DataLoader<string, User>(
    async (_userIds: readonly string[]) => {
      return [];
    },
  );
}
