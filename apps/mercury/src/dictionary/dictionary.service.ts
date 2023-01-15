// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import type { Repository } from 'typeorm';
// project
import { Dictionary } from './entities/dictionary.entity';
import { paginateQuery } from 'utils/api';
import type { CreateDictionaryInput } from './dtos/create-dictionary.input';
import type { QueryParameters } from 'typings/api';
import type { UpdateDictionaryInput } from './dtos/update-dictionary.input';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private readonly dictionaryRepository: Repository<Dictionary>,
  ) {}

  /**
   * 创建字典
   */
  create(dictionary: CreateDictionaryInput) {
    return this.dictionaryRepository.save(
      this.dictionaryRepository.create(dictionary),
    );
  }

  /**
   * 分页查询字典
   */
  getDictionaries(queryParams?: QueryParameters) {
    return paginateQuery(this.dictionaryRepository, queryParams);
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
  async update(id: number, dictionary: UpdateDictionaryInput) {
    return !!(
      await this.dictionaryRepository
        .createQueryBuilder()
        .update()
        .set({
          ...dictionary,
        })
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
