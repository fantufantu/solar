// nest
import { Module } from '@nestjs/common';
// project
import { GraphQLModule } from '@app/graphql';
import { DatabaseModule } from '@app/database';
import { PassportModule } from '@app/passport';
import { ApplicationToken } from 'assets/tokens';
import { AccountBookModule } from './account-book/account-book.module';
import { ShareModule } from './share/share.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    // api
    GraphQLModule,
    // 数据库
    DatabaseModule.forRoot(ApplicationToken.Venus),
    // 鉴权
    PassportModule,
    // 用户信息
    UserProfileModule,
    // 账本
    AccountBookModule,
    // 分享
    ShareModule,
    // 分类
    CategoryModule,
    // 交易
    TransactionModule,
  ],
})
export class AppModule {}
