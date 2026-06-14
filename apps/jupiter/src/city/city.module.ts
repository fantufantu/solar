import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from '@/libs/database/entities/jupiter/city.entity';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { CityResolver } from './city.resolver';
import { CityService } from './city.service';
import { CityLoader } from './city.loader';

@Module({
  imports: [TypeOrmModule.forFeature([City, Attraction])],
  providers: [CityResolver, CityService, CityLoader],
  exports: [CityService],
})
export class CityModule {}
