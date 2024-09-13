// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { In, Repository } from 'typeorm';
// project
import { CreateSubjectBy } from './dto/create-subject-by.input';
import { FilterSubjectBy } from './dto/filter-subject-by.input';
import { UpdateSubjectBy } from './dto/update-subject-by.input';
import { Subject } from './entities/subject.entity';
import { QueryBy } from 'typings/api';
import { paginateQuery } from 'utils/api';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  /**
   * @description
   * 创建科目
   */
  create(createBy: CreateSubjectBy) {
    return this.subjectRepository.save(this.subjectRepository.create(createBy));
  }

  /**
   * @description
   * 查询科目列表
   */
  getCategories(queryBy?: QueryBy<FilterSubjectBy>) {
    const { filterBy, ..._queryBy } = queryBy || {};
    const { ids, ...filterByWithout } = filterBy || {};

    return paginateQuery(this.subjectRepository, {
      ..._queryBy,
      filterBy: {
        ...filterByWithout,
        ...(ids && {
          id: In(ids),
        }),
      },
    });
  }

  /**
   * @description
   * 查询科目
   */
  getSubject(id: number) {
    return this.subjectRepository.findOneBy({
      id,
    });
  }

  /**
   * @description
   * 更新科目
   */
  async update(id: number, updateBy: UpdateSubjectBy) {
    return !!(
      await this.subjectRepository.update(
        id,
        this.subjectRepository.create(updateBy),
      )
    ).affected;
  }

  /**
   * @description
   * 删除科目
   */
  async remove(id: number) {
    return !!(await this.subjectRepository.delete(id)).affected;
  }
}
