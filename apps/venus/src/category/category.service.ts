// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { In, Repository } from 'typeorm';
// project
import { CreateCategoryInput } from './dto/create-category.input';
import { FilterCategoryInput } from './dto/filter-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';
import { QueryParameters } from 'typings/api';
import { paginateQuery } from 'utils/api';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * 创建分类
   */
  create(createCategoryInput: CreateCategoryInput) {
    return this.categoryRepository.save(
      this.categoryRepository.create(createCategoryInput),
    );
  }

  /**
   * 查询分类列表
   */
  getCategories(queryParams?: QueryParameters<FilterCategoryInput>) {
    const { filter, ...otherQueryParams } = queryParams;
    const { ids, ...otherFilter } = filter || {};

    return paginateQuery(this.categoryRepository, {
      ...otherQueryParams,
      filter: {
        ...otherFilter,
        ...(ids && {
          id: In(ids),
        }),
      },
    });
  }

  /**
   * 查询分类
   */
  getCategory(id: number) {
    return this.categoryRepository.findOneBy({
      id,
    });
  }

  /**
   * 更新分类
   */
  async update(id: number, updateCategoryInput: UpdateCategoryInput) {
    return !!(
      await this.categoryRepository.update(id, {
        ...updateCategoryInput,
      })
    ).affected;
  }

  /**
   * 删除分类
   */
  async remove(id: number) {
    return !!(await this.categoryRepository.delete(id)).affected;
  }
}
