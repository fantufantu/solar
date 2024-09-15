import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../../../libs/database/src/entities/earth/category.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [],
})
export class CategoryModule {}
