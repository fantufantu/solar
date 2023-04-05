// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { In, Repository } from 'typeorm';
// project
import { CreateCategoryBy } from './dto/create-category-by.input';
import { FilterCategoryBy } from './dto/filter-category-by.input';
import { UpdateCategoryBy } from './dto/update-category-by.input';
import { Category } from './entities/category.entity';
import { QueryBy } from 'typings/api';
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
  create(createCategoryBy: CreateCategoryBy) {
    return this.categoryRepository.save(
      this.categoryRepository.create(createCategoryBy),
    );
  }

  /**
   * 查询分类列表
   */
  getCategories(queryBy?: QueryBy<FilterCategoryBy>) {
    const { filterBy, ...queryByWithout } = queryBy || {};
    const { ids, ...filterByWithout } = filterBy || {};

    return paginateQuery(this.categoryRepository, {
      ...queryByWithout,
      filterBy: {
        ...filterByWithout,
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
  async update(id: number, updateCategoryBy: UpdateCategoryBy) {
    return !!(
      await this.categoryRepository.update(
        id,
        this.categoryRepository.create(updateCategoryBy),
      )
    ).affected;
  }

  /**
   * 删除分类
   */
  async remove(id: number) {
    return !!(await this.categoryRepository.delete(id)).affected;
  }
}
