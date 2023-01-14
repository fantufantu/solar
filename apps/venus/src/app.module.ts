// nest
import { Module } from '@nestjs/common';
// project
import { GraphQLModule } from '@app/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@app/database';
import { ApplicationToken } from 'assets/tokens';
import { PassportModule } from '@app/passport';
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
    // 账本
    AccountBookModule,
    ShareModule,
    UserProfileModule,
    CategoryModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
