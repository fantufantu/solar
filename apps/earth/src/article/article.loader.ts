import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Repository } from 'typeorm';
import { Article } from '@/lib/database/entities/earth/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Partialable } from '@aiszlab/relax/types';

@Injectable()
export class ArticleLoader {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  /**
   * @description
   * 根据文章id读取分类列表
   */
  public readonly getCategoryCodesByArticleId = new DataLoader<
    number,
    string[]
  >(
    async (articleIds) => {
      const articles = (
        await this.articleRepository
          .createQueryBuilder('article')
          .leftJoinAndMapMany(
            'article.articleToCategory',
            'article.articleToCategory',
            'categories',
          )
          .whereInIds(articleIds)
          .getMany()
      ).reduce<Map<number, Partialable<string[]>>>((prev, article) => {
        return prev.set(
          article.id,
          article.articleToCategory?.map((_) => _.categoryCode),
        );
      }, new Map());

      return articleIds.map((articleId) => {
        return articles.get(articleId) ?? [];
      });
    },
    {
      cache: false,
    },
  );
}
