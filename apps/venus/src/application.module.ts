import { Module } from '@nestjs/common';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from '@/lib/database';
import { PassportModule } from '@/lib/passport';
import { ApplicationToken } from 'assets/tokens';
import { BillingModule } from './billing/billing.module';
import { SharingModule } from './sharing/sharing.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { MercuryClientModule } from '@/lib/mercury-client';

@Module({
  imports: [
    // mercury 微服务客户端
    MercuryClientModule,
    // api
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    // 数据库
    DatabaseModule.forRoot(ApplicationToken.Venus),
    // 鉴权
    PassportModule,
    // 用户信息
    UserModule,
    // 账本
    BillingModule,
    // 分享
    SharingModule,
    // 分类
    CategoryModule,
    // 交易
    TransactionModule,
  ],
})
export class ApplicationModule {}
