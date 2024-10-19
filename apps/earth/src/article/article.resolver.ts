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
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { CreateArticleBy } from './dto/create-article-by.input';
import { Filter, Pagination, WhoAmI } from 'assets/decorators';
import { User } from '@/libs/database/entities/earth/user.entity';
import { UpdateArticleBy } from './dto/update-article-by.input';
import { PaginatedArticles } from './dto/paginated-articles.object';
import { PaginateBy } from 'assets/dto/paginate-by.input';
import { FilterArticlesBy } from './dto/filter-articles-by.input';
import { PaginatedInterceptor } from 'assets/interceptor/paginated.interceptor';
import { ArticleLoader } from './article.loader';
import { Category } from '@/libs/database/entities/earth/category.entity';
import { Article } from '@/libs/database/entities/earth/article.entity';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(
    private readonly articleService: ArticleService,
    private readonly articleLoader: ArticleLoader,
  ) {}

  @Mutation(() => Article, { name: 'createArticle', description: '创建文章' })
  @UseGuards(JwtAuthGuard)
  async create(
    @Args('createBy') createBy: CreateArticleBy,
    @WhoAmI() whoAmI: User,
  ) {
    return await this.articleService.create(createBy, whoAmI.id);
  }

  @Mutation(() => Boolean, {
    name: 'updateArticle',
    description: '更新文章',
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Args('id', {
      type: () => Int,
    })
    id: number,
    @Args('updateBy') updateBy: UpdateArticleBy,
    @WhoAmI() whoAmI: User,
  ) {
    return await this.articleService.update(id, updateBy, whoAmI.id);
  }

  @Query(() => PaginatedArticles, {
    name: 'articles',
    description: '分页查询文章',
  })
  @UseInterceptors(PaginatedInterceptor)
  async getArticles(
    @Pagination() paginateBy: PaginateBy,
    @Filter({
      type: () => FilterArticlesBy,
    })
    filterBy: FilterArticlesBy,
  ) {
    return await this.articleService.articles({
      paginateBy,
      filterBy,
    });
  }

  @Mutation(() => Boolean, {
    name: 'removeArticle',
    description: '删除文章',
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Args('id', { type: () => Int }) id: number,
    @WhoAmI() whoAmI: User,
  ) {
    return await this.articleService.remove(id, whoAmI.id);
  }

  @Query(() => Article, {
    name: 'article',
    description: '根据id查询文章',
  })
  async getArticleById(
    @Args('id', { type: () => Int, description: 'id' }) id: number,
  ) {
    return await this.articleService.getArticleById(id);
  }

  @ResolveField(() => [Category], {
    name: 'categories',
    description: '文章关联的文章分类列表',
  })
  async getCategories(@Parent() article: Article) {
    return await this.articleLoader.getCategoriesByArticleId.load(article.id);
  }

  @ResolveField('createdBy', () => User, {
    description: '创作者',
    nullable: true,
  })
  getCreatedBy(@Parent() article: Article) {
    return { __typename: User.name, id: article.createdById };
  }
}
