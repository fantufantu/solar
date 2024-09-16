import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/lib/database';
import { ApplicationToken } from 'assets/tokens';
import { ArticleModule } from './article/article.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';

@Module({
  imports: [
    // api
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    // 数据库
    DatabaseModule.forRoot(ApplicationToken.Earth),
    // 文章
    ArticleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
