import { Category } from '@/lib/database/entities/earth/category.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateBy } from 'assets/dto/paginate-by.input';
import { Repository } from 'typeorm';
import { FilterCategoriesBy } from './dto/filter-categories-by.input';
import { paginateQuery } from 'utils/api';
import { QueryBy } from 'typings/api';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * @description
   * 分页查询分类
   */
  async getCategories({
    paginateBy: { limit, page } = { limit: 10, page: 1 },
    filterBy: { keyword } = {},
  }: QueryBy<FilterCategoriesBy>) {
    const _queryBuilder = this.categoryRepository.createQueryBuilder();

    if (keyword) {
      _queryBuilder
        .where(`code REGEXP :code`)
        .orWhere(`name REGEXP :name`)
        .setParameters({
          code: keyword,
          name: keyword,
        });
    }

    return await _queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }
}
