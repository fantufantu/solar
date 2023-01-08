// nest
import { Module } from '@nestjs/common';
// project
import { ShareModule } from '../share/share.module';
import { AccountBookService } from './account-book.service';
import { AccountBookResolver } from './account-book.resolver';

@Module({
  imports: [ShareModule],
  providers: [AccountBookResolver, AccountBookService],
})
export class AccountBookModule {}
