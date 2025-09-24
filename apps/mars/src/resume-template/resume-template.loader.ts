import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { ResumeTemplateService } from './resume-template.service';
import { ResumeTemplate } from '@/libs/database/entities/mars/resume-template.entity';
import { Nullable } from '@aiszlab/relax/types';
import { ResumeService } from '../resume/resume.service';

@Injectable()
export class ResumeTemplateLoader {
  constructor(private readonly resumeService: ResumeService) {}

  /**
   * 根据模板`code`统计引用次数
   */
  readonly citationCount = new DataLoader<string, number>(
    async (codes: string[]) => {
      const resumes = await this.resumeService.resumes({
        templateCodes: codes,
      });

      const citationCounts = resumes.reduce((counts, resume) => {
        const count = counts.get(resume.defaultTemplateCode) ?? 0;
        counts.set(resume.defaultTemplateCode, count + 1);
        return counts;
      }, new Map<string, number>());

      return codes.map((code) => citationCounts.get(code) ?? 0);
    },
  );
}
