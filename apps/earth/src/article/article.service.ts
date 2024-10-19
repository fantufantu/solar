import { Injectable } from '@nestjs/common';
import { CreateArticleBy } from './dto/create-article-by.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '@/libs/database/entities/earth/article.entity';
import { Repository } from 'typeorm';
import { UpdateArticleBy } from './dto/update-article-by.input';
import { FilterArticlesBy } from './dto/filter-articles-by.input';
import { QueryBy } from 'typings/application-programming-interface';
import { ArticleToCategory } from '@/libs/database/entities/earth/article_to_category.entity';
import { isEmpty } from '@aiszlab/relax';
import { ArticleContributionsBy } from './dto/article-contributions-by.input';
import dayjs from 'dayjs';
import { ArticleContribution } from './dto/article-contribution.object';

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
        // 作者id
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
   * @param id 文章id
   * @param updateBy 更新文章信息
   * @param updatedById 更新者id
   */
  async update(id: number, updateBy: UpdateArticleBy, updatedById: number) {
    const { categoryCodes, ...article } = updateBy;

    // 更新文章
    if (!isEmpty(article)) {
      await this.articleRepository
        .createQueryBuilder()
        .update()
        .set(
          this.articleRepository.create({
            ...article,
            updatedById,
          }),
        )
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
  async articles({
    paginateBy: { limit, page } = { limit: 10, page: 1 },
    filterBy: { categoryCodes = [] } = {},
  }: QueryBy<FilterArticlesBy> = {}) {
    const _sqb = this.articleRepository.createQueryBuilder('article');

    if (categoryCodes.length > 0) {
      _sqb
        .andWhere((queryBuilder) => {
          const query = queryBuilder
            .subQuery()
            .select('articleToCategory.articleId')
            .from(ArticleToCategory, 'articleToCategory')
            .where('articleToCategory.categoryCode IN (:...categoryCodes)')
            .getQuery();
          return 'article.id IN' + query;
        })
        .setParameter('categoryCodes', categoryCodes);
    }

    const articles = await _sqb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return articles;
  }

  /**
   * @description
   * 删除文章
   * @param id 文章id
   * @param deletedById 删除者id
   */
  async remove(id: number, deletedById: number) {
    await this.articleRepository
      .createQueryBuilder()
      .update()
      .set({
        updatedById: deletedById,
        deletedAt: 'NOW()',
      })
      .whereInIds(id)
      .execute();

    return true;
  }

  /**
   * @description
   * 根据文章id查询文章
   */
  async getArticleById(id: number) {
    return await this.articleRepository.findOneBy({ id });
  }

  /**
   * @description
   * 指定时间段内文章贡献数
   */
  async articleContributions(
    { from, to }: ArticleContributionsBy,
    who: number,
  ) {
    // 性能考虑：不允许超过1年时间查询
    if (dayjs(from).isBefore(dayjs(to).subtract(1, 'years'))) {
      throw new Error('时间跨度过大，请不要超过一年');
    }

    return (await this.articleRepository
      .createQueryBuilder('article')
      .select('COUNT(article.id)', 'count')
      .addSelect('DATE(article.createdAt)', 'contributedAt')
      .groupBy('contributedAt')
      .where('article.createdAt BETWEEN :from AND :to')
      .andWhere('article.createdById = :who')
      .setParameters({ from, to, who })
      .getRawMany()) as Array<ArticleContribution>;
  }
}
