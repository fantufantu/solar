import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { Transaction } from '@/lib/database/entities/venus/transaction.entity';
import { CategoryModule } from '../category/category.module';
import { TransactionLoader } from './transaction.loader';
import { BillingModule } from '../billing/billing.module';

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
