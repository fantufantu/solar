import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateResumeInput } from './dto/create-resume.input';
import { UpdateResumeInput } from './dto/update-resume.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from '@/libs/database/entities/mars/resume.entity';
import { Brackets, Repository } from 'typeorm';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { MercuryClientService } from '@/libs/mercury-client';
import { AuthorizationResourceCode } from '@/libs/database/entities/mercury/authorization-resource.entity';
import { AuthorizationActionCode } from '@/libs/database/entities/mercury/authorization-action.entity';
import { PaginateBy } from 'assets/dto/paginate-by.input';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
    private readonly mercuryClientService: MercuryClientService,
  ) {}

  /**
   * 新建简历
   */
  async create(createResumeInput: CreateResumeInput, who: User) {
    return await this.resumeRepository.save(
      this.resumeRepository.create({
        ...createResumeInput,
        createdById: who.id,
      }),
    );
  }

  /**
   * 更新简历
   */
  async update(id: number, updateResumeInput: UpdateResumeInput, who: User) {
    return (
      ((
        await this.resumeRepository.update(id, {
          ...updateResumeInput,
          updatedById: who.id,
        })
      ).affected ?? 0) > 0
    );
  }

  /**
   * 删除简历
   * @description 逻辑删除，更新人为当前用户
   */
  async remove(id: number, who: User) {
    const _resume = this.resumeRepository.create();
    _resume.deletedById = who.id;

    return (
      ((await this.resumeRepository.update(id, _resume)).affected ?? 0) > 0
    );
  }

  /**
   * 简历详情
   * @description 用户只能查看自己的简历
   */
  async resume(id: string, who: User) {
    const _resume = await this.resumeRepository.findOneBy({
      id,
    });

    if (!_resume) {
      throw new Error('简历不存在！');
    }

    if (_resume.createdById !== who.id) {
      throw new ForbiddenException('您没有权限查看该简历！');
    }

    return _resume;
  }

  /**
   * 查询简历列表
   * @description
   * 1. 如果当前用户是管理员，则返回所有简历；
   * 2. 如果当前用户是普通用户，则返回当前用户的简历；
   */
  async resumes(who: number, { limit, page }: PaginateBy) {
    const isAdmin = await this.mercuryClientService.isAuthorized(who, {
      resource: AuthorizationResourceCode.Authorization,
      action: AuthorizationActionCode.All,
    });

    const _qb = this.resumeRepository
      .createQueryBuilder('resume')
      .skip((page - 1) * limit)
      .take(limit)
      .where('1 = 1');

    if (!isAdmin) {
      _qb.andWhere(
        new Brackets((qb) => {
          qb.where('resume.createdById = :who', { who }).orWhere(
            'resume.updatedById = :who',
            { who },
          );
        }),
      );
    }

    return await _qb.getManyAndCount();
  }
}
