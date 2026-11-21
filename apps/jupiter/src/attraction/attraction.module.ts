import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { AttractionResolver } from './attraction.resolver.js';
import { AttractionService } from './attraction.service.js';
import { AttractionLoader } from './attraction.loader.js';
import { DistrictModule } from '../district/district.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Attraction]), DistrictModule],
  providers: [AttractionResolver, AttractionService, AttractionLoader],
  exports: [AttractionService],
})
export class AttractionModule {}
