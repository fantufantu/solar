// nest
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { Transaction } from './entities/transaction.entity';
import { CategoryModule } from '../category/category.module';
import { TransactionLoader } from './transaction.loader';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => CategoryModule),
  ],
  providers: [TransactionLoader, TransactionService, TransactionResolver],
  exports: [TransactionService],
})
export class TransactionModule {}
