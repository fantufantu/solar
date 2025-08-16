import { Injectable } from '@nestjs/common';
import { CreateResumeTemplateInput } from './dto/create-resume-template.input';
import { UpdateResumeTemplateInput } from './dto/update-resume-template.input';
import { ResumeTemplate } from '@/libs/database/entities/mars/resume-template.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'assets/dto/pagination.input';
import { User } from '@/libs/database/entities/mars/user.entity';

@Injectable()
export class ResumeTemplateService {
  constructor(
    @InjectRepository(ResumeTemplate)
    private readonly resumeTemplateRepository: Repository<ResumeTemplate>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * @description 创建简历模板
   */
  async create(input: CreateResumeTemplateInput, who: number) {
    return await this.resumeTemplateRepository.save(
      this.resumeTemplateRepository.create({
        ...input,
        createdById: who,
      }),
    );
  }

  /**
   * @description 更新简历模板
   */
  async update(code: string, input: UpdateResumeTemplateInput, who: number) {
    return !!(await this.resumeTemplateRepository.save(
      this.resumeTemplateRepository.create({
        code,
        ...input,
        updatedById: who,
      }),
    ));
  }

  /**
   * @description 删除简历模板
   */
  async remove(id: number, deletedById: number) {
    const _resumeTemplate = this.resumeTemplateRepository.create();
    _resumeTemplate.deletedById = deletedById;

    return (
      ((await this.resumeTemplateRepository.update(id, _resumeTemplate))
        .affected ?? 0) > 0
    );
  }

  /**
   * @description 分页查询简历模板列表
   */
  async resumeTemplates({
    pagination: { limit = Infinity, page = 1 } = {},
    where: { codes = [] } = {},
  }: {
    pagination?: Partial<Pagination>;
    where?: { codes?: string[] };
  }) {
    const qb = this.resumeTemplateRepository
      .createQueryBuilder('resumeTemplate')
      .skip((page - 1) * limit)
      .take(limit)
      .where('1 = 1');

    if (codes.length > 0) {
      qb.where('resumeTemplate.code IN (:...codes)', {
        codes,
      });
    }

    return await qb.getManyAndCount();
  }

  /**
   * @description 查询简历模板详情
   */
  async resumeTemplate(code: string) {
    return await this.resumeTemplateRepository.findOneBy({ code });
  }

  /**
   * @description 收藏的简历模板列表
   * 当前用户收藏的简历模板列表数据，使用分页格式数据返回
   */
  async starredResumeTemplates({
    pagination: { limit, page },
    who,
  }: {
    pagination: Pagination;
    who: number;
  }): Promise<[ResumeTemplate[], number]> {
    const _starredResumeTemplateCodes =
      (
        await this.userRepository.findOneBy({
          id: who,
        })
      )?.starredResumeTemplateCodes ?? [];

    if (_starredResumeTemplateCodes.length === 0) {
      return [[], 0];
    }

    return await this.resumeTemplateRepository
      .createQueryBuilder('resumeTemplate')
      .where('resumeTemplate.code IN (:...codes)', {
        codes: _starredResumeTemplateCodes,
      })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }
}
