import { Module } from '@nestjs/common';
import { ResumeTemplateService } from './resume-template.service';
import { ResumeTemplateResolver } from './resume-template.resolver';

@Module({
  providers: [ResumeTemplateResolver, ResumeTemplateService],
})
export class ResumeTemplateModule {}
