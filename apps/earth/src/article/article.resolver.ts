import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ArticleService } from './article.service';
import { Article } from '../../../../libs/database/src/entities/earth/article.entity';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '@/lib/passport/guards';
import { CreateArticleBy } from './dto/create-article-by.input';
import { Filter, Pagination, WhoAmI } from 'assets/decorators';
import { User } from '../../../mercury/src/user/entities/user.entity';
import { UpdateArticleInput } from './dto/update-article-by.input';
import { PaginatedArticles } from './dto/paginated-articles.object';
import { PaginateBy } from 'assets/dto';
import { FilterArticlesBy } from './dto/filter-articles-by.input';
import { PaginatedInterceptor } from 'assets/interceptor/paginated.interceptor';

@Resolver()
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Mutation(() => Article, { name: 'createArticle', description: '创建文章' })
  @UseGuards(new JwtAuthGuard(true))
  create(@Args('createBy') createBy: CreateArticleBy, @WhoAmI() user: User) {
    return this.articleService.create(createBy, user.id);
  }

  @Mutation(() => Boolean, {
    name: 'updateArticle',
    description: '更新文章',
  })
  update(
    @Args('id', {
      type: () => Int,
    })
    id: number,
    @Args('updateArticleInput') updateBy: UpdateArticleInput,
  ) {
    return this.articleService.update(id, updateBy);
  }

  @Query(() => PaginatedArticles, {
    name: 'articles',
    description: '分页查询文章',
  })
  @UseInterceptors(PaginatedInterceptor)
  getArticles(
    @Pagination() paginateBy: PaginateBy,
    @Filter({
      type: () => FilterArticlesBy,
      nullable: false,
    })
    filterBy: FilterArticlesBy,
  ) {
    return this.articleService.getArticles({
      paginateBy,
      filterBy,
    });
  }
}
