import { Injectable } from '@nestjs/common';
import { CreateResumeTemplateInput } from './dto/create-resume-template.input';
import { UpdateResumeTemplateInput } from './dto/update-resume-template.input';
import { ResumeTemplate } from '@/libs/database/entities/mars/resume-template.entity';
import { Brackets, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'assets/dto/pagination.input';
import { User } from '@/libs/database/entities/mars/user.entity';
import { ResumeService } from '../resume/resume.service';
import { RecommendedResumeTemplatesArgs } from './dto/recommended-resume-templates.args';

@Injectable()
export class ResumeTemplateService {
  constructor(
    @InjectRepository(ResumeTemplate)
    private readonly resumeTemplateRepository: Repository<ResumeTemplate>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly resumeService: ResumeService,
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
  async remove(code: string, deletedById: number) {
    const _resumeTemplate = this.resumeTemplateRepository.create();
    _resumeTemplate.deletedById = deletedById;

    return (
      ((await this.resumeTemplateRepository.update(code, _resumeTemplate))
        .affected ?? 0) > 0
    );
  }

  /**
   * @description 分页查询简历模板列表
   */
  async resumeTemplates({
    pagination: { limit = 0, page = 1 } = {},
    where: { codes = [] } = {},
  }: {
    pagination?: Partial<Pagination>;
    where?: { codes?: string[] };
  }) {
    const qb = this.resumeTemplateRepository
      .createQueryBuilder('resumeTemplate')
      .where('1 = 1');

    if (limit > 0) {
      qb.skip(Math.max(0, page - 1) * limit).take(limit);
    }

    if (codes.length > 0) {
      qb.andWhere('resumeTemplate.code IN (:...codes)', {
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

  /**
   * 推荐的简历
   * @description
   * 1. 推荐引用次数最多的模板列表
   * 2. 传入`code`时，返回指定模板相同标签的模板
   */
  async recommendedResumeTemplates({ code }: RecommendedResumeTemplatesArgs) {
    const _tags =
      (code
        ? (await this.resumeTemplateRepository.findOneBy({ code }))?.tags
        : null) ?? [];

    let _codes: string[] = [];

    if (_tags.length > 0) {
      _codes = (
        await this.resumeTemplateRepository
          .createQueryBuilder('resumeTemplate')
          .where(
            new Brackets((qb) => {
              for (const _tag of _tags) {
                qb.orWhere('resumeTemplate.tags REGEXP :tag', {
                  tag: `^${_tag},|,${_tag},|,${_tag}$`,
                });
              }
            }),
          )
          .getMany()
      ).map((item) => item.code);
    }

    const _recommendedCodes = (
      await this.resumeService.countByTemplateCode(_codes)
    )
      .slice(0, 5)
      .map((item) => item.templateCode);

    return await this.resumeTemplateRepository.find({
      where: {
        code: In(_recommendedCodes),
      },
    });
  }
}
