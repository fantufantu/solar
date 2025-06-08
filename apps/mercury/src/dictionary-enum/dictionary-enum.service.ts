import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { DictionaryEnum } from '@/libs/database/entities/mercury/dictionary-enum.entity';
import { paginateQuery } from 'utils/query-builder';
import type { QueryBy } from 'typings/controller';
import type { CreateDictionaryEnumBy } from './dto/create-dictionary-enum-by.input';
import type { UpdateDictionaryEnumBy } from './dto/update-dictionary-enum-by.input';

@Injectable()
export class DictionaryEnumService {
  constructor(
    @InjectRepository(DictionaryEnum)
    private readonly dictionaryEnumRepository: Repository<DictionaryEnum>,
  ) {}

  /**
   * 创建字典枚举
   */
  create(createBy: CreateDictionaryEnumBy) {
    return this.dictionaryEnumRepository.save(
      this.dictionaryEnumRepository.create(createBy),
    );
  }

  /**
   * 分页查询字典枚举
   */
  getDictionaryEnums(queryBy?: QueryBy<DictionaryEnum>) {
    return paginateQuery(this.dictionaryEnumRepository, queryBy);
  }

  /**
   * 查询单个字典枚举
   */
  getDictionaryEnum(id: number) {
    return this.dictionaryEnumRepository.findOneBy({ id });
  }

  /**
   * 更新单个字典枚举
   */
  async update(id: number, updateBy: UpdateDictionaryEnumBy) {
    return !!(
      await this.dictionaryEnumRepository
        .createQueryBuilder()
        .update()
        .set(this.dictionaryEnumRepository.create(updateBy))
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * 删除单个字典枚举
   */
  async remove(id: number) {
    return !!(
      await this.dictionaryEnumRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
        .execute()
    ).affected;
  }
}
