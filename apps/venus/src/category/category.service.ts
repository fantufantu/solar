import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateCategoryBy } from './dto/create-category-by.input';
import { FilterCategoryBy } from './dto/filter-category-by.input';
import { UpdateCategoryBy } from './dto/update-category-by.input';
import { Category } from '@/lib/database/entities/venus/category.entity';
import { QueryBy } from 'typings/api';
import { paginateQuery } from 'utils/api';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * @description
   * 创建分类
   */
  create(createBy: CreateCategoryBy) {
    return this.categoryRepository.save(
      this.categoryRepository.create(createBy),
    );
  }

  /**
   * @description
   * 查询分类列表
   */
  getCategories(queryBy?: QueryBy<FilterCategoryBy>) {
    const { filterBy, ..._queryBy } = queryBy || {};
    const { ids, ..._filterBy } = filterBy || {};

    return paginateQuery(this.categoryRepository, {
      ..._queryBy,
      filterBy: {
        ..._filterBy,
        ...(ids && {
          id: In(ids),
        }),
      },
    });
  }

  /**
   * @description
   * 查询分类
   */
  getCategory(id: number) {
    return this.categoryRepository.findOneBy({
      id,
    });
  }

  /**
   * @description
   * 更新分类
   */
  async update(id: number, updateBy: UpdateCategoryBy) {
    return !!(
      await this.categoryRepository.update(
        id,
        this.categoryRepository.create(updateBy),
      )
    ).affected;
  }

  /**
   * @description
   * 删除分类
   */
  async remove(id: number) {
    return !!(await this.categoryRepository.delete(id)).affected;
  }
}
