import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTransactionCategoryInput } from './dto/create-category.input';
import { FilterTransactionCategoryInput } from './dto/filter-categories.input';
import { UpdateTransactionCategoryInput } from './dto/update-category.input';
import { Category } from '@/libs/database/entities/venus/category.entity';
import { Query } from 'typings/controller';
import { paginateQuery } from 'utils/query-builder';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * @description 创建交易分类
   */
  create(input: CreateTransactionCategoryInput) {
    return this.categoryRepository.save(this.categoryRepository.create(input));
  }

  /**
   * @description 查询交易分类列表
   */
  categories({
    filter: { ids, ..._filter } = { ids: [] },
    ..._query
  }: Query<FilterTransactionCategoryInput>) {
    return paginateQuery(this.categoryRepository, {
      ..._query,
      filter: {
        ..._filter,
        ...(ids.length > 0 && {
          id: In(ids),
        }),
      },
    });
  }

  /**
   * @description 查询交易分类
   */
  category(id: number) {
    return this.categoryRepository.findOneBy({
      id,
    });
  }

  /**
   * @description 更新交易分类
   */
  async update(id: number, input: UpdateTransactionCategoryInput) {
    return !!(
      await this.categoryRepository.update(
        id,
        this.categoryRepository.create(input),
      )
    ).affected;
  }

  /**
   * @description 删除交易分类
   */
  async remove(id: number) {
    return !!(await this.categoryRepository.delete(id)).affected;
  }
}
