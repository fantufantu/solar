import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service.js';
import { TransactionResolver } from './transaction.resolver.js';
import { Transaction } from '@/libs/database/entities/venus/transaction.entity';
import { CategoryModule } from '../category/category.module.js';
import { TransactionLoader } from './transaction.loader.js';
import { BillingModule } from '../billing/billing.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => CategoryModule),
    BillingModule,
  ],
  providers: [TransactionLoader, TransactionService, TransactionResolver],
  exports: [TransactionService],
})
export class TransactionModule {}
