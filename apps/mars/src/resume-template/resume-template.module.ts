import { forwardRef, Module } from '@nestjs/common';
import { ResumeTemplateService } from './resume-template.service';
import { ResumeTemplateResolver } from './resume-template.resolver';
import { ResumeTemplate } from '@/libs/database/entities/mars/resume-template.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/libs/database/entities/mars/user.entity';
import { ResumeTemplateLoader } from './resume-template.loader';
import { ResumeModule } from '../resume/resume.module';

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
