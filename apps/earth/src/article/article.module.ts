import { Module } from '@nestjs/common';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '@/lib/database/entities/earth/article.entity';
import { ArticleToCategory } from '@/lib/database/entities/earth/article_to_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleToCategory])],
  providers: [ArticleResolver, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
