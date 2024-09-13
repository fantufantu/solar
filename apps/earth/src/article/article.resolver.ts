import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/passport/guards';
import { CreateArticleBy } from './dto/create-article-by';

@Resolver()
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Mutation(() => Article, { description: '创建文章' })
  @UseGuards(new JwtAuthGuard(true))
  createDictionary(@Args('createBy') createBy: CreateArticleBy) {
    return this.articleService.create(createBy);
  }
}
