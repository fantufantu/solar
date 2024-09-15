import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/lib/database/entities/earth/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [],
})
export class CategoryModule {}
