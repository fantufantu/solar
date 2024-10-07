import { Injectable } from '@nestjs/common';
import { CreateArticleBy } from './dto/create-article-by.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '@/lib/database/entities/earth/article.entity';
import { Repository } from 'typeorm';
import { UpdateArticleBy } from './dto/update-article-by.input';
import { FilterArticlesBy } from './dto/filter-articles-by.input';
import { QueryBy } from 'typings/api';
import { ArticleToCategory } from '@/lib/database/entities/earth/article_to_category.entity';
import { isEmpty } from '@aiszlab/relax';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(ArticleToCategory)
    private readonly articleToCategoryRepository: Repository<ArticleToCategory>,
  ) {}

  /**
   * @description
   * 创建文章
   */
  async create(createBy: CreateArticleBy, createdById: number) {
    const { categoryCodes, ..._article } = createBy;

    const article = await this.articleRepository.save(
      this.articleRepository.create({
        ..._article,
        // 作者
        createdById,
      }),
    );

    // 添加文章和文章分类的关联关系
    await this.articleToCategoryRepository.save(
      categoryCodes.map((categoryCode) =>
        this.articleToCategoryRepository.create({
          articleId: article.id,
          categoryCode,
        }),
      ),
    );

    return article;
  }

  /**
   * @description
   * 更新文章
   */
  async update(id: number, updateBy: UpdateArticleBy) {
    const { categoryCodes, ...article } = updateBy;

    // 更新文章
    if (!isEmpty(article)) {
      await this.articleRepository
        .createQueryBuilder()
        .update()
        .set(article)
        .whereInIds(id)
        .execute();
    }

    // 更新关联的文章分类codes
    if (!!categoryCodes) {
      await this.articleToCategoryRepository
        .createQueryBuilder()
        .delete()
        .where({ articleId: id })
        .execute();

      await this.articleToCategoryRepository
        .createQueryBuilder()
        .insert()
        .values(
          categoryCodes.map((categoryCode) =>
            this.articleToCategoryRepository.create({
              articleId: id,
              categoryCode,
            }),
          ),
        )
        .execute();
    }

    return true;
  }

  /**
   * @description
   * 分页查询文章列表
   */
  async getArticles({
    paginateBy: { limit, page } = { limit: 10, page: 1 },
    filterBy: { categoryCodes = [] } = {},
  }: QueryBy<FilterArticlesBy> = {}) {
    const _sqb = this.articleRepository.createQueryBuilder();

    if (categoryCodes.length > 0) {
      _sqb
        .andWhere((queryBuilder) => {
          const query = queryBuilder
            .subQuery()
            .select('articleToCategory.article_id')
            .from(ArticleToCategory, 'articleToCategory')
            .where('articleToCategory.category_code IN (:...categoryCodes)')
            .getQuery();
          return 'article.id IN' + query;
        })
        .setParameter('categoryCodes', categoryCodes);
    }

    const articles = await _sqb
      .skip((page - 1) * limit)
      .limit(limit)
      .getManyAndCount();

    return articles;
  }

  /**
   * @description
   * 删除文章
   */
  async remove(id: number) {
    return !!(
      await this.articleRepository
        .createQueryBuilder()
        .softDelete()
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * @description
   * 根据文章id查询文章
   */
  async getArticleById(id: number) {
    return await this.articleRepository.findOneBy({ id });
  }
}
