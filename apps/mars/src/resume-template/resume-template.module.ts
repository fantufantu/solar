import { forwardRef, Module } from '@nestjs/common';
import { ResumeTemplateService } from './resume-template.service.js';
import { ResumeTemplateResolver } from './resume-template.resolver.js';
import { ResumeTemplate } from '@/libs/database/entities/mars/resume-template.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/libs/database/entities/mars/user.entity';
import { ResumeTemplateLoader } from './resume-template.loader.js';
import { ResumeModule } from '../resume/resume.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResumeTemplate, User]),
    forwardRef(() => ResumeModule),
  ],
  providers: [
    ResumeTemplateLoader,
    ResumeTemplateResolver,
    ResumeTemplateService,
  ],
  exports: [ResumeTemplateService],
})
export class ResumeTemplateModule {}
