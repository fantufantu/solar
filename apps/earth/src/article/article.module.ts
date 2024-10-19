import { Module } from '@nestjs/common';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';
import { ArticleLoader } from './article.loader';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '@/libs/database/entities/earth/article.entity';
import { ArticleToCategory } from '@/libs/database/entities/earth/article_to_category.entity';
import { Category } from '@/libs/database/entities/earth/category.entity';
import { User } from '@/libs/database/entities/earth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Category, ArticleToCategory, User]),
  ],
  providers: [ArticleLoader, ArticleResolver, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
