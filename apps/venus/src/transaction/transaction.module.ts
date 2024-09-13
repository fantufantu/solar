// nest
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { Transaction } from './entities/transaction.entity';
import { SubjectModule } from '../subject/subject.module';
import { TransactionLoader } from './transaction.loader';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => SubjectModule),
    BillingModule,
  ],
  providers: [TransactionLoader, TransactionService, TransactionResolver],
  exports: [TransactionService],
})
export class TransactionModule {}
