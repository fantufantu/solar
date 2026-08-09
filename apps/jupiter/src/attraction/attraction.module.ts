import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { AttractionResolver } from './attraction.resolver';
import { AttractionService } from './attraction.service';
import { AttractionLoader } from './attraction.loader';
import { DistrictModule } from '../district/district.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attraction]), DistrictModule],
  providers: [AttractionResolver, AttractionService, AttractionLoader],
  exports: [AttractionService],
})
export class AttractionModule {}
