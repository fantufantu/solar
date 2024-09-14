import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/passport/guards';
import { CreateArticleBy } from './dto/create-article-by';
import { WhoAmI } from 'assets/decorators';
import { User } from '../user/entities/user.entity';

@Resolver()
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Mutation(() => Article, { description: '创建文章' })
  @UseGuards(new JwtAuthGuard(true))
  createDictionary(
    @Args('createBy') createBy: CreateArticleBy,
    @WhoAmI() user: User,
  ) {
    return this.articleService.create(createBy);
  }

  @Mutation(() => Boolean, {
    description: '更新文章',
  })
  updateEssay(
    @Args('id', {
      type: () => Int,
    })
    id: number,
    @Args('updateEssayInput') essay: UpdateEssayInput,
  ) {
    return this.essayService.update(id, essay);
  }
}
