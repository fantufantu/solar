// nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { ShareModule } from '../share/share.module';
import { AccountBookService } from './account-book.service';
import { AccountBookResolver } from './account-book.resolver';
import { AccountBookLoader } from './account-book.loader';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { AccountBook } from './entities/account-book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountBook]),
    UserProfileModule,
    ShareModule,
    UserProfileModule,
  ],
  providers: [AccountBookLoader, AccountBookService, AccountBookResolver],
})
export class AccountBookModule {}
