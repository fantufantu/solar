// nest
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { Transaction } from './entities/transaction.entity';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => CategoryModule),
  ],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
