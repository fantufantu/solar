import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateResumeInput } from './dto/create-resume.input';
import { UpdateResumeInput } from './dto/update-resume.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from '@/libs/database/entities/mars/resume.entity';
import { Repository } from 'typeorm';
import { User } from '@/libs/database/entities/mercury/user.entity';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
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
  async update(id: string, updateResumeInput: UpdateResumeInput, who: User) {
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
    return (
      ((
        await this.resumeRepository.update(
          id,
          this.resumeRepository.create().useDelete(who.id),
        )
      ).affected ?? 0) > 0
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
}
