import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateCategoryBy } from './dto/create-category-by.input';
import { FilterCategoriesBy } from './dto/filter-categories-by.input';
import { UpdateCategoryBy } from './dto/update-category-by.input';
import { Category } from '@/libs/database/entities/venus/category.entity';
import { QueryBy } from 'typings/application-programming-interface';
import { paginateQuery } from 'utils/query-builder';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * @description
   * 创建交易分类
   */
  create(createBy: CreateCategoryBy) {
    return this.categoryRepository.save(
      this.categoryRepository.create(createBy),
    );
  }

  /**
   * @description
   * 查询交易分类列表
   */
  getCategories({
    filterBy: { ids, ..._filterBy } = { ids: [] },
    ..._queryBy
  }: QueryBy<FilterCategoriesBy>) {
    return paginateQuery(this.categoryRepository, {
      ..._queryBy,
      filterBy: {
        ..._filterBy,
        ...(ids.length > 0 && {
          id: In(ids),
        }),
      },
    });
  }

  /**
   * @description
   * 查询交易分类
   */
  getCategory(id: number) {
    return this.categoryRepository.findOneBy({
      id,
    });
  }

  /**
   * @description
   * 更新交易分类
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
   * 删除交易分类
   */
  async remove(id: number) {
    return !!(await this.categoryRepository.delete(id)).affected;
  }
}
