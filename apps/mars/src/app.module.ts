import { Module } from '@nestjs/common';
import { ResumeModule } from './resume/resume.module';
import { DatabaseModule } from '@/libs/database';
import { ApplicationToken } from 'assets/tokens';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { PassportModule } from '@/libs/passport';

@Module({
  imports: [
    // api
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    // 鉴权
    PassportModule,
    // 数据库
    DatabaseModule.forRoot(ApplicationToken.Mars, { synchronize: true }),
    // 简历模块
    ResumeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
