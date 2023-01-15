// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { In, Repository } from 'typeorm';
// project
import { CreateCategoryInput } from './dto/create-category.input';
import { FilterCategoryArgs } from './dto/filter-category.args';
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
   * @param createCategoryInput
   * @returns
   */
  create(createCategoryInput: CreateCategoryInput) {
    return this.categoryRepository.save(
      this.categoryRepository.create(createCategoryInput),
    );
  }

  /**
   * 查询分类列表
   * @param query
   * @returns
   */
  getCategories(queryArgs?: QueryParameters<FilterCategoryArgs>) {
    const { filterArgs, ...otherQueryArgs } = queryArgs;
    const { ids, ...otherFilterArgs } = filterArgs || {};

    return paginateQuery(this.categoryRepository, {
      ...otherQueryArgs,
      filterInput: {
        ...otherFilterArgs,
        ...(ids && {
          id: In(ids),
        }),
      },
    });
  }

  /**
   * 查询分类
   * @param id
   * @returns
   */
  getCategory(id: number) {
    return this.categoryRepository.findOneBy({
      id,
    });
  }

  /**
   * 更新分类
   * @param id
   * @param updateCategoryInput
   * @returns
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
   * @param id
   * @returns
   */
  async remove(id: number) {
    return !!(await this.categoryRepository.delete(id)).affected;
  }
}
