import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Dictionary } from '@/lib/database/entities/mercury/dictionary.entity';
import { paginateQuery } from 'utils/query-builder';
import type { CreateDictionaryBy } from './dto/create-dictionary-by.input';
import type { QueryBy } from 'typings/application-programming-interface';
import type { UpdateDictionaryBy } from './dto/update-dictionary-by.input';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private readonly dictionaryRepository: Repository<Dictionary>,
  ) {}

  /**
   * 创建字典
   */
  create(createBy: CreateDictionaryBy) {
    return this.dictionaryRepository.save(
      this.dictionaryRepository.create(createBy),
    );
  }

  /**
   * 分页查询字典
   */
  getDictionaries(queryBy?: QueryBy<Dictionary>) {
    return paginateQuery(this.dictionaryRepository, queryBy);
  }

  /**
   * 查询单个字典
   */
  getDictionay(id: number) {
    return this.dictionaryRepository.findOneBy({ id });
  }

  /**
   * 更新字典
   */
  async update(id: number, updateBy: UpdateDictionaryBy) {
    return !!(
      await this.dictionaryRepository
        .createQueryBuilder()
        .update()
        .set(this.dictionaryRepository.create(updateBy))
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * 删除字典
   */
  async remove(id: number) {
    return !!(
      await this.dictionaryRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
        .execute()
    ).affected;
  }
}
