import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ArticleService } from './article.service';
import { Article } from '../../../../libs/database/src/entities/earth/article.entity';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '@/lib/passport/guards';
import { CreateArticleBy } from './dto/create-article-by.input';
import { Filter, Pagination, WhoAmI } from 'assets/decorators';
import { User } from '@/lib/database/entities/earth/user.entity';
import { UpdateArticleBy } from './dto/update-article-by.input';
import { PaginatedArticles } from './dto/paginated-articles.object';
import { PaginateBy } from 'assets/dto/paginate-by.input';
import { FilterArticlesBy } from './dto/filter-articles-by.input';
import { PaginatedInterceptor } from 'assets/interceptor/paginated.interceptor';
import { ArticleLoader } from './article.loader';
import { Category } from '@/lib/database/entities/earth/category.entity';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(
    private readonly articleService: ArticleService,
    private readonly articleloader: ArticleLoader,
  ) {}

  @Mutation(() => Article, { name: 'createArticle', description: '创建文章' })
  @UseGuards(JwtAuthGuard)
  create(@Args('createBy') createBy: CreateArticleBy, @WhoAmI() user: User) {
    return this.articleService.create(createBy, 1);
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
    @Args('updateBy') updateBy: UpdateArticleBy,
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

  @Mutation(() => Boolean, {
    name: 'removeArticle',
    description: '删除文章',
  })
  async remove(@Args('id', { type: () => Int }) id: number) {
    return await this.articleService.remove(id);
  }

  @Query(() => Article, {
    name: 'article',
    description: '根据id查询文章',
  })
  @UseGuards(JwtAuthGuard)
  async getArticleById(
    @Args('id', { type: () => Int, description: 'id' }) id: number,
  ) {
    return await this.articleService.getArticleById(id);
  }

  @ResolveField(() => [Category], {
    name: 'categories',
    description: '文章关联的分类列表',
  })
  async getCategories(@Parent() article: Article) {
    return await this.articleloader.getCategoriesByArticleId.load(article.id);
  }

  @ResolveField('createdBy', () => User, {
    description: '创作者',
    nullable: true,
  })
  getCreatedBy(@Parent() article: Article) {
    return { __typename: User.name, id: article.createdById };
  }
}
