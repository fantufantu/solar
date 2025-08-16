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
import { ResumeTemplateModule } from './resume-template/resume-template.module';
import { MercuryClientModule } from '@/libs/mercury-client';
import { UserModule } from './user/user.module';
import { User } from '@/libs/database/entities/mars/user.entity';

@Module({
  imports: [
    // `mercury`微服务客户端
    MercuryClientModule,
    // API
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      buildSchemaOptions: {
        orphanedTypes: [User],
      },
    }),
    // 数据库
    DatabaseModule.forRoot(ApplicationToken.Mars),
    // 鉴权
    PassportModule,
    // 简历模块
    ResumeModule,
    // 简历模板模块
    ResumeTemplateModule,
    // 用户模块
    UserModule,
  ],
})
export class AppModule {}
