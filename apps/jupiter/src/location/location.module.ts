import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from '@/libs/database/entities/jupiter/district.entity';
import { LocationResolver } from './location.resolver';
import { LocationService } from './location.service';

@Module({
  imports: [TypeOrmModule.forFeature([District])],
  providers: [LocationResolver, LocationService],
})
export class LocationModule {}
