import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from '@/libs/database/entities/jupiter/district.entity';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { DistrictResolver } from './district.resolver';
import { DistrictService } from './district.service';
import { DistrictLoader } from './district.loader';

@Module({
  imports: [TypeOrmModule.forFeature([District, Attraction])],
  providers: [DistrictResolver, DistrictService, DistrictLoader],
  exports: [DistrictService],
})
export class DistrictModule {}
