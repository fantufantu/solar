import { forwardRef, Module } from '@nestjs/common';
import { ResumeService } from './resume.service.js';
import { ResumeResolver } from './resume.resolver.js';
import { Resume } from '@/libs/database/entities/mars/resume.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeLoader } from './resume.loader.js';
import { ResumeTemplateModule } from '../resume-template/resume-template.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resume]),
    forwardRef(() => ResumeTemplateModule),
  ],
  providers: [ResumeLoader, ResumeResolver, ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
