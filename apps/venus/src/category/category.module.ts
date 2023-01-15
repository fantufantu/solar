// nest
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { Category } from './entities/category.entity';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => TransactionModule),
  ],
  providers: [CategoryService, CategoryResolver],
})
export class CategoryModule {}
