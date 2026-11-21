import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from '@/libs/database/entities/jupiter/district.entity';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { DistrictResolver } from './district.resolver.js';
import { DistrictService } from './district.service.js';
import { DistrictLoader } from './district.loader.js';

@Module({
  imports: [TypeOrmModule.forFeature([District, Attraction])],
  providers: [DistrictResolver, DistrictService, DistrictLoader],
  exports: [DistrictService],
})
export class DistrictModule {}
