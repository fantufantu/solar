// nest
import { Module } from '@nestjs/common';
// project
import { GraphQLModule } from '@app/graphql';
import { DatabaseModule } from '@app/database';
import { PassportModule } from '@app/passport';
import { ApplicationToken } from 'assets/tokens';
import { BillingModule } from './billing/billing.module';
import { SharingModule } from './sharing/sharing.module';
import { UserProfileModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { MercuryClientModule } from '@app/mercury-client';

@Module({
  imports: [
    // mercury 微服务客户端
    MercuryClientModule,
    // api
    GraphQLModule,
    // 数据库
    DatabaseModule.forRoot(ApplicationToken.Venus),
    // 鉴权
    PassportModule,
    // 用户信息
    UserProfileModule,
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
export class AppModule {}
