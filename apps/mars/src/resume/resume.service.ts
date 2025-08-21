import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateResumeInput } from './dto/create-resume.input';
import { UpdateResumeInput } from './dto/update-resume.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from '@/libs/database/entities/mars/resume.entity';
import { Brackets, Repository } from 'typeorm';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { MercuryClientService } from '@/libs/mercury-client';
import { Pagination } from 'assets/dto/pagination.input';
import { AuthorizationActionCode } from '@/libs/database/entities/mercury/authorization.entity';
import dayjs from 'dayjs';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
    private readonly mercuryClientService: MercuryClientService,
  ) {}

  /**
   * @description 新建简历
   */
  async create(input: CreateResumeInput, who: User) {
    return await this.resumeRepository.save(
      this.resumeRepository.create({
        ...input,
        createdById: who.id,
      }),
    );
  }

  /**
   * @description 更新简历
   */
  async update(id: string, input: UpdateResumeInput, who: User) {
    return (
      ((
        await this.resumeRepository.update(id, {
          ...input,
          updatedById: who.id,
        })
      ).affected ?? 0) > 0
    );
  }

  /**
   * 删除简历
   * @description 逻辑删除，更新人为当前用户
   * @param id
   * @param who
   * @param permanently 永久删除
   */
  async remove(id: string, who: number, permanently: boolean) {
    const _resume = this.resumeRepository.create();
    _resume.deletedById = who;

    if (permanently) {
      _resume.deletedAt = dayjs(0).toDate();
    }

    return (
      ((await this.resumeRepository.update(id, _resume)).affected ?? 0) > 0
    );
  }

  /**
   * 简历详情
   * @description 用户只能查看自己的简历
   */
  async resume(id: string, who: number) {
    const _resume = await this.resumeRepository.findOneBy({
      id,
    });

    if (!_resume) {
      throw new Error('简历不存在！');
    }

    if (_resume.createdById !== who) {
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
  async resumes(who: number, { limit, page }: Pagination) {
    const isAdmin = await this.mercuryClientService.isAuthorized(who, {
      resource: Resume.name,
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

  /**
   * @description 最近30天删除的简历列表
   */
  async deletedResumes(who: number, { limit, page }: Pagination) {
    const _qb = this.resumeRepository
      .createQueryBuilder('resume')
      .skip((page - 1) * limit)
      .take(limit)
      .where('resume.deletedAt >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)')
      .andWhere('resume.createdById = :who', { who })
      .orderBy('resume.deletedAt', 'DESC');

    return await _qb.getManyAndCount();
  }
}
