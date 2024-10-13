import { Category } from '@/lib/database/entities/earth/category.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterCategoriesBy } from './dto/filter-categories-by.input';
import { QueryBy } from 'typings/application-programming-interface';
import { CreateCategoryBy } from './dto/create-category-by.input';
import { UpdateCategoryBy } from './dto/update-category-by.input';
import { ArticleToCategory } from '@/lib/database/entities/earth/article_to_category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(ArticleToCategory)
    private readonly articleToCategoryRepository: Repository<ArticleToCategory>,
  ) {}

  /**
   * @description
   * 分页查询文章分类
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

  /**
   * @description
   * 创建文章分类
   */
  async create(createBy: CreateCategoryBy) {
    return await this.categoryRepository.save(
      this.categoryRepository.create(createBy),
    );
  }

  /**
   * @description
   * 更新文章分类
   */
  async update(id: number, updateBy: UpdateCategoryBy) {
    return !!(
      await this.categoryRepository
        .createQueryBuilder()
        .update(this.categoryRepository.create(updateBy))
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * @description
   * 删除文章分类
   */
  async remove(id: number) {
    const _category = await this.categoryRepository.findOneBy({ id });

    if (!_category) {
      throw new Error('当前文章分类不存在！');
    }

    // 删除文章与文章分类的关联关系
    await this.articleToCategoryRepository
      .createQueryBuilder()
      .delete()
      .where({
        categoryCode: _category.code,
      })
      .execute();

    // 删除分类
    return !!(
      await this.categoryRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * @description
   * 获取文章分类
   */
  async getCategory(id: number) {
    return await this.categoryRepository.findOneBy({ id });
  }
}
