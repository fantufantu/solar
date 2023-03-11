// nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserLoader } from './user.loader';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), BillingModule],
  providers: [UserLoader, UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
