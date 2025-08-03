import { Category } from '@/libs/database/entities/earth/category.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterArticleCategoriesInput } from './dto/filter-categories.input';
import { Query } from 'typings/controller';
import { CreateArticleCategoryInput } from './dto/create-category.input';
import { UpdateArticleCategoryInput } from './dto/update-category.input';
import { ArticleWithCategory } from '@/libs/database/entities/earth/article-with-category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(ArticleWithCategory)
    private readonly articleWithCategoryRepository: Repository<ArticleWithCategory>,
  ) {}

  /**
   * @description
   * 分页查询文章分类
   */
  async getCategories({
    pagination: { limit, page } = { limit: 10, page: 1 },
    filter: { keyword } = {},
  }: Query<FilterArticleCategoriesInput>) {
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
   * @description 创建文章分类
   */
  async create(input: CreateArticleCategoryInput) {
    return await this.categoryRepository.save(
      this.categoryRepository.create(input),
    );
  }

  /**
   * @description 更新文章分类
   */
  async update(id: number, input: UpdateArticleCategoryInput) {
    return !!(
      await this.categoryRepository
        .createQueryBuilder()
        .update(this.categoryRepository.create(input))
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * @description 删除文章分类
   */
  async remove(code: string) {
    const _category = await this.categoryRepository.findOneBy({ code });

    if (!_category) {
      throw new Error('当前文章分类不存在！');
    }

    // 删除文章与文章分类的关联关系
    await this.articleWithCategoryRepository
      .createQueryBuilder()
      .delete()
      .where({
        categoryCode: _category.code,
      })
      .execute();

    // 删除分类
    return (
      ((
        await this.categoryRepository
          .createQueryBuilder()
          .delete()
          .where({ code })
          .execute()
      ).affected ?? 0) > 0
    );
  }

  /**
   * @description 获取文章分类
   */
  async category(code: string) {
    return await this.categoryRepository.findOneBy({ code });
  }
}
