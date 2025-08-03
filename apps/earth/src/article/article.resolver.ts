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
import { CreateArticleInput } from './dto/create-article.input';
import { User } from '@/libs/database/entities/earth/user.entity';
import { UpdateArticleInput } from './dto/update-article.input';
import { PaginatedArticles } from './dto/paginated-articles.object';
import { Pagination } from 'assets/dto/pagination.input';
import { FilterArticlesInput } from './dto/filter-articles.input';
import { PaginatedInterceptor } from 'assets/interceptors/paginated.interceptor';
import { ArticleLoader } from './article.loader';
import { Category } from '@/libs/database/entities/earth/category.entity';
import { Article } from '@/libs/database/entities/earth/article.entity';
import { ArticleContribution } from './dto/article-contribution.object';
import { FilterArticleContributionsInput } from './dto/filter-article-contributions.input';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { FilterArgs } from 'utils/decorators/filter.decorator';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(
    private readonly articleService: ArticleService,
    private readonly articleLoader: ArticleLoader,
  ) {}

  @Mutation(() => Article, { name: 'createArticle', description: '创建文章' })
  @UseGuards(JwtAuthGuard)
  async create(
    @Args('input') input: CreateArticleInput,
    @WhoAmI() whoAmI: User,
  ) {
    return await this.articleService.create(input, whoAmI.id);
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
    @Args('input') input: UpdateArticleInput,
    @WhoAmI() whoAmI: User,
  ) {
    return await this.articleService.update(id, input, whoAmI.id);
  }

  @Query(() => PaginatedArticles, {
    name: 'articles',
    description: '分页查询文章',
  })
  @UseInterceptors(PaginatedInterceptor)
  async getArticles(
    @PaginationArgs() pagination: Pagination,
    @FilterArgs({
      type: () => FilterArticlesInput,
    })
    filter: FilterArticlesInput,
  ) {
    return await this.articleService.articles({
      pagination,
      filter,
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

  @Query(() => [ArticleContribution], {
    description: '文章贡献数',
  })
  @UseGuards(JwtAuthGuard)
  async articleContributions(
    @FilterArgs() filter: FilterArticleContributionsInput,
    @WhoAmI() whoAmI: User,
  ) {
    return this.articleService.articleContributions(filter, whoAmI.id);
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
