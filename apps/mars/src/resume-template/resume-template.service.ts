import { Injectable } from '@nestjs/common';
import { CreateResumeTemplateInput } from './dto/create-resume-template.input';
import { UpdateResumeTemplateInput } from './dto/update-resume-template.input';
import { ResumeTemplate } from '@/libs/database/entities/mars/resume-template.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateBy } from 'assets/dto/paginate-by.input';

@Injectable()
export class ResumeTemplateService {
  constructor(
    @InjectRepository(ResumeTemplate)
    private readonly resumeTemplateRepository: Repository<ResumeTemplate>,
  ) {}

  /**
   * @description 创建简历模板
   */
  async create(
    createResumeTemplateInput: CreateResumeTemplateInput,
    who: number,
  ) {
    return await this.resumeTemplateRepository.save(
      this.resumeTemplateRepository.create({
        ...createResumeTemplateInput,
        createdById: who,
      }),
    );
  }

  /**
   * @description 更新简历模板
   */
  async update(
    id: number,
    updateResumeTemplateInput: UpdateResumeTemplateInput,
    who: number,
  ) {
    return !!(await this.resumeTemplateRepository.save(
      this.resumeTemplateRepository.create({
        id,
        ...updateResumeTemplateInput,
        updatedById: who,
      }),
    ));
  }

  /**
   * @description 删除简历模板
   */
  async remove(id: number, who: number) {
    const _resumeTemplate = this.resumeTemplateRepository.create({ id });

    return (
      ((
        await this.resumeTemplateRepository.update(
          _resumeTemplate.id,
          _resumeTemplate.useDelete(who),
        )
      ).affected ?? 0) > 0
    );
  }

  /**
   * @description 分页查询简历模板列表
   */
  async resumeTemplates({
    paginateBy: { limit, page },
  }: {
    paginateBy: PaginateBy;
  }) {
    return await this.resumeTemplateRepository
      .createQueryBuilder()
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  /**
   * @description 查询简历模板详情
   */
  async resumeTemplate(id: number) {
    return await this.resumeTemplateRepository.findOneBy({ id });
  }
}
