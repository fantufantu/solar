import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { ResumeTemplateService } from '../resume-template/resume-template.service';
import { ResumeTemplate } from '@/libs/database/entities/mars/resume-template.entity';
import { Nullable } from '@aiszlab/relax/types';

@Injectable()
export class ResumeLoader {
  constructor(private readonly resumeTemplateService: ResumeTemplateService) {}

  /**
   * @author murukal
   * @description
   * 根据模板`code`查询模板列表
   */
  readonly resumeTemplates = new DataLoader<string, Nullable<ResumeTemplate>>(
    async (codes: string[]) => {
      const [resumeTemplates] =
        await this.resumeTemplateService.resumeTemplates({
          where: { codes },
        });
      const _resumeTemplates = resumeTemplates.reduce(
        (prev, _resumeTemplate) =>
          prev.set(_resumeTemplate.code, _resumeTemplate),
        new Map<string, ResumeTemplate>(),
      );

      return codes.map((_code) => _resumeTemplates.get(_code) ?? null);
    },
  );
}
