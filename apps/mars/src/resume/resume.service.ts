import { Injectable } from '@nestjs/common';
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
  async update(id: number, updateResumeInput: UpdateResumeInput, who: User) {
    return await this.resumeRepository.update(id, {
      ...updateResumeInput,
      updatedById: who.id,
    });
  }

  /**
   * 删除简历
   */
  async remove(id: number) {
    return await this.resumeRepository.update(id, {
      deletedAt: 'NOW()',
    });
  }
}
