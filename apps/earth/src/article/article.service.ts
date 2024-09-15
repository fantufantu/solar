// nest
import { Injectable } from '@nestjs/common';
import { CreateArticleBy } from './dto/create-article-by.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../../../../libs/database/src/entities/earth/article.entity';
import { Repository } from 'typeorm';
import { UpdateArticleInput } from './dto/update-article-by.input';
import { isEmpty } from '@aiszlab/relax';
import { Category } from '../../../../libs/database/src/entities/earth/category.entity';
import { FilterArticlesBy } from './dto/filter-articles-by.input';
import { QueryBy } from 'typings/api';
import { ArticleToCategory } from '@/lib/database/entities/earth/article_to_category.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
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

    // 添加文章和分类的关联关系
    await this.articleRepository
      .createQueryBuilder()
      .relation('categories')
      .of(article.id)
      .add(categoryCodes);

    return article;
  }

  /**
   * @description
   * 更新文章
   */
  async update(id: number, updateBy: UpdateArticleInput) {
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

    // 更新关联的分类codes
    if (!!categoryCodes) {
      const _relation = this.articleRepository
        .createQueryBuilder()
        .relation('categories')
        .of(id);

      await _relation.addAndRemove(
        categoryCodes,
        (await _relation.loadMany<Category>()).map((tag) => tag.id),
      );
    }

    return true;
  }

  /**
   * @description
   * 分页查询文章列表
   */
  async getArticles(queryBy: QueryBy<FilterArticlesBy> = {}) {
    const {
      paginateBy: { limit = 1, page = 1 } = {},
      filterBy: { categorCodes = [0] } = {},
    } = queryBy;

    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .where((queryBuilder) => {
        const query = queryBuilder
          .subQuery()
          .select('articleToCategory.article_id')
          .from(ArticleToCategory, 'articleToCategory')
          .where('articleToCategory.category_code IN (:...categoryCodes)')
          .getQuery();
        return 'article.id IN' + query;
      })
      .setParameter('categoryCodes', categorCodes)
      .skip((page - 1) * limit)
      .limit(limit)
      .getManyAndCount();

    return articles;
  }
}
