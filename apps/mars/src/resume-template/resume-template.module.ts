import { Module } from '@nestjs/common';
import { ResumeTemplateService } from './resume-template.service';
import { ResumeTemplateResolver } from './resume-template.resolver';
import { ResumeTemplate } from '@/libs/database/entities/mars/resume-template.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ResumeTemplate])],
  providers: [ResumeTemplateResolver, ResumeTemplateService],
})
export class ResumeTemplateModule {}
