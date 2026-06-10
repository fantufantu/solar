import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { AttractionResolver } from './attraction.resolver';
import { AttractionService } from './attraction.service';
import { AttractionLoader } from './attraction.loader';
import { CityModule } from '../city/city.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attraction]), CityModule],
  providers: [AttractionResolver, AttractionService, AttractionLoader],
  exports: [AttractionService],
})
export class AttractionModule {}
