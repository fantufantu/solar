// nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { SharingService } from './sharing.service';
import { SharingResolver } from './sharing.resolver';
import { Sharing } from './entities/sharing.entity';
import { SharingLoader } from './sharing.loader';

@Module({
  imports: [TypeOrmModule.forFeature([Sharing])],
  providers: [SharingLoader, SharingService, SharingResolver],
  exports: [SharingService],
})
export class SharingModule {}
