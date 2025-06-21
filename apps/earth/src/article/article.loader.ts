import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleWithCategory } from '@/libs/database/entities/earth/article_with_category.entity';
import { Category } from '@/libs/database/entities/earth/category.entity';

@Injectable()
export class ArticleLoader {
  constructor(
    @InjectRepository(ArticleWithCategory)
    private readonly articleWithCategoryRepository: Repository<ArticleWithCategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * @description
   * 读取文章关联的文章分类列表
   */
  public readonly getCategoriesByArticleId = new DataLoader<number, Category[]>(
    async (articleIds) => {
      const categoryCodes = (
        await this.articleWithCategoryRepository
          .createQueryBuilder()
          .select('DISTINCT category_code')
          .where({
            articleId: In(articleIds),
          })
          .getRawMany<{ category_code: string }>()
      ).map(({ category_code }) => category_code);

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
        await this.articleWithCategoryRepository
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
