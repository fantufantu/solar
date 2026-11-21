import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharingService } from './sharing.service';
import { SharingResolver } from './sharing.resolver';
import { Sharing } from '@/libs/database/entities/venus/sharing.entity';
import { SharingLoader } from './sharing.loader';

@Module({
  imports: [TypeOrmModule.forFeature([Sharing])],
  providers: [SharingLoader, SharingService, SharingResolver],
  exports: [SharingService],
})
export class SharingModule {}
