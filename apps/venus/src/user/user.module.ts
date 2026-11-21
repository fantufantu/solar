import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service.js';
import { User } from '@/libs/database/entities/venus/user.entity';
import { UserResolver } from './user.resolver.js';
import { UserLoader } from './user.loader.js';
import { BillingModule } from '../billing/billing.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([User]), BillingModule],
  providers: [UserLoader, UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
