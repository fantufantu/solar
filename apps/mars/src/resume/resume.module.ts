import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeResolver } from './resume.resolver';
import { Resume } from '@/libs/database/entities/mars/resume.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeLoader } from './resume.loader';

@Module({
  imports: [TypeOrmModule.forFeature([Resume])],
  providers: [ResumeLoader, ResumeResolver, ResumeService],
})
export class ResumeModule {}
