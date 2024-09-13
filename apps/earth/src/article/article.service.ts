// nest
import { Injectable } from '@nestjs/common';
import { CreateArticleBy } from './dto/create-article-by';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  /**
   * @description
   * 创建文章
   */
  async create(createBy: CreateArticleBy, createdById: number) {
    const { categoryIds, ..._article } = createBy;

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
      .add(categoryIds);

    return article;
  }
}
