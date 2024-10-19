import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/libs/database/entities/earth/category.entity';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { ArticleToCategory } from '@/libs/database/entities/earth/article_to_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, ArticleToCategory])],
  providers: [CategoryResolver, CategoryService],
})
export class CategoryModule {}
