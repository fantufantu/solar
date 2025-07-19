import { Injectable } from '@nestjs/common';
import { CreateArticleBy } from './dto/create-article-by.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '@/libs/database/entities/earth/article.entity';
import { Repository } from 'typeorm';
import { UpdateArticleBy } from './dto/update-article-by.input';
import { FilterArticlesBy } from './dto/filter-articles-by.input';
import { QueryBy } from 'typings/controller';
import { ArticleWithCategory } from '@/libs/database/entities/earth/article-with-category.entity';
import { isEmpty } from '@aiszlab/relax';
import { ArticleContributionsBy } from './dto/article-contributions-by.input';
import dayjs from 'dayjs';
import { ArticleContribution } from './dto/article-contribution.object';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(ArticleWithCategory)
    private readonly articleWithCategoryRepository: Repository<ArticleWithCategory>,
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
    await this.articleWithCategoryRepository.save(
      categoryCodes.map((categoryCode) =>
        this.articleWithCategoryRepository.create({
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
      await this.articleWithCategoryRepository
        .createQueryBuilder()
        .delete()
        .where({ articleId: id })
        .execute();

      await this.articleWithCategoryRepository
        .createQueryBuilder()
        .insert()
        .values(
          categoryCodes.map((categoryCode) =>
            this.articleWithCategoryRepository.create({
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
            .select('articleWithCategory.articleId')
            .from(ArticleWithCategory, 'articleWithCategory')
            .where('articleWithCategory.categoryCode IN (:...categoryCodes)')
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
   * @param deleteById 删除者id
   */
  async remove(id: number, deleteById: number) {
    const _article = this.articleRepository.create();
    _article.deletedById = deleteById;

    return (
      ((await this.articleRepository.update(id, _article)).affected ?? 0) > 0
    );
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
