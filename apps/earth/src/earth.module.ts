import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/lib/database';
import { ApplicationToken } from 'assets/tokens';
import { ArticleModule } from './article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '@/lib/database/entities/earth/article.entity';
import { Category } from '@/lib/database/entities/earth/category.entity';
import { ArticleToCategory } from '@/lib/database/entities/earth/article_to_category.entity';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';

@Module({
  imports: [
    // GraphQL 模块
    // GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    //   autoSchemaFile: true,
    //   driver: ApolloFederationDriver,
    // }),
    // 数据库
    DatabaseModule.forRoot(ApplicationToken.Earth),
    // 文章
    ArticleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
