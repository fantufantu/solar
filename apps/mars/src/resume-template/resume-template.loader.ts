import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { ResumeService } from '../resume/resume.service';

@Injectable()
export class ResumeTemplateLoader {
  constructor(private readonly resumeService: ResumeService) {}

  /**
   * 根据模板`code`统计引用次数
   */
  readonly citationCount = new DataLoader<string, number>(
    async (codes: string[]) => {
      const citationCounts = new Map(
        (await this.resumeService.countByTemplateCode(codes)).map(
          ({ count, templateCode }) => [templateCode, count],
        ),
      );

      return codes.map((code) => citationCounts.get(code) ?? 0);
    },
  );
}
