import { Module } from '@nestjs/common';
import { ArticleResolver } from './article.resolver.js';
import { ArticleService } from './article.service.js';
import { ArticleLoader } from './article.loader.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '@/libs/database/entities/earth/article.entity';
import { ArticleWithCategory } from '@/libs/database/entities/earth/article-with-category.entity';
import { Category } from '@/libs/database/entities/earth/category.entity';
import { User } from '@/libs/database/entities/earth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Category, ArticleWithCategory, User]),
  ],
  providers: [ArticleLoader, ArticleResolver, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
