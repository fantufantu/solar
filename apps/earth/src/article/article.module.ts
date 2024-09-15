import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../../../../libs/database/src/entities/earth/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [],
})
export class ArticleModule {}
