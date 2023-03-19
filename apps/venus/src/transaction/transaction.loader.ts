// nest
import { Injectable } from '@nestjs/common';
// third
import DataLoader = require('dataloader');
// project
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TransactionLoader {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 根据分类 id 获取分类信息
   */
  readonly getCategoryById = new DataLoader<number, Category>(
    async (ids: number[]) => {
      const [categories] = await this.categoryService.getCategories({
        filter: {
          ids,
        },
      });

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
