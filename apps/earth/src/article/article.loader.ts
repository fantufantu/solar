import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Article } from '@/lib/database/entities/earth/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Partialable } from '@aiszlab/relax/types';
import { ArticleToCategory } from '@/lib/database/entities/earth/article_to_category.entity';
import { Category } from '@/lib/database/entities/earth/category.entity';

@Injectable()
export class ArticleLoader {
  constructor(
    @InjectRepository(ArticleToCategory)
    private readonly articleToCategoryRepository: Repository<ArticleToCategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * @description
   * 读取文章关联的分类列表
   */
  public readonly getCategoriesByArticleId = new DataLoader<number, Category[]>(
    async (articleIds) => {
      const categoryCodes = (
        await this.articleToCategoryRepository
          .createQueryBuilder()
          .select('DISTINCT categoryCode')
          .where({
            articleId: In(articleIds),
          })
          .getRawMany<{ categoryCode: string }>()
      ).map(({ categoryCode }) => categoryCode);

      const categories = (
        categoryCodes.length > 0
          ? await this.categoryRepository
              .createQueryBuilder()
              .where({
                code: In(categoryCodes),
              })
              .getMany()
          : []
      ).reduce(
        (prev, _category) => prev.set(_category.code, _category),
        new Map<string, Category>(),
      );

      const relations = (
        await this.articleToCategoryRepository
          .createQueryBuilder()
          .where({
            articleId: In(articleIds),
          })
          .getMany()
      ).reduce(
        (prev, { articleId, categoryCode }) =>
          prev.set(articleId, new Set(prev.get(articleId)).add(categoryCode)),
        new Map<number, Set<string>>(),
      );

      return articleIds.map((articleId) => {
        return Array.from(relations.get(articleId) ?? []).reduce<Category[]>(
          (prev, categoryCode) => {
            const _category = categories.get(categoryCode);
            _category && prev.push(_category);
            return prev;
          },
          [],
        );
      });
    },
    {
      cache: false,
    },
  );
}
