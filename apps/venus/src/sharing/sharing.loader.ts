// nest
import { Injectable } from '@nestjs/common';
// third
import DataLoader = require('dataloader');
// project
import { User } from 'apps/mercury/src/auth/entities/user.entity';

@Injectable()
export class SharingLoader {
  /**
   * 根据用户id获取用户信息
   */
  public readonly getUserById = new DataLoader<number, User>(
    async (userIds: number[]) => {
      return [];
    },
  );
}
