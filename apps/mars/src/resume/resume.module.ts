import { forwardRef, Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeResolver } from './resume.resolver';
import { Resume } from '@/libs/database/entities/mars/resume.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeLoader } from './resume.loader';
import { ResumeTemplateModule } from '../resume-template/resume-template.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resume]),
    forwardRef(() => ResumeTemplateModule),
  ],
  providers: [ResumeLoader, ResumeResolver, ResumeService],
})
export class ResumeModule {}
