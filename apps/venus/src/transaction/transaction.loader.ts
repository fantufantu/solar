// nest
import { Injectable } from '@nestjs/common';
// third
import DataLoader = require('dataloader');
// project
import { User } from 'apps/mercury/src/auth/entities/user.entity';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class TransactionLoader {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 根据分类 id 获取分类信息
   */
  readonly getCategoryById = new DataLoader<number, Category>(
    async (ids: number[]) => {
      const categories = (
        await this.categoryService.getCategories({
          filterArgs: {
            ids,
          },
        })
      ).items;

      return ids.map((id) => categories.find((category) => category.id === id));
    },
  );

  /**
   * 根据用户 id 获取用户信息
   */
  readonly getUserById = new DataLoader<number, User>(async () => {
    return [];
  });
}
