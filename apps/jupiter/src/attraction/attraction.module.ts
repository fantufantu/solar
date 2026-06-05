import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { AttractionResolver } from './attraction.resolver';
import { AttractionService } from './attraction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attraction])],
  providers: [AttractionResolver, AttractionService],
  exports: [AttractionService],
})
export class AttractionModule {}
