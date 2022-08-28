// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import type { Repository } from 'typeorm';
// project
import { DictionaryEnum } from './entities/dictionary-enum.entity';
import { paginateQuery } from 'utils/api';
import type { QueryParams } from 'typings/api';
import type { CreateDictionaryEnumInput } from './dtos/create-dictionary-enum.input';
import type { UpdateDictionaryEnumInput } from './dtos/update-dictionary-enum.input';

@Injectable()
export class DictionaryEnumService {
  constructor(
    @InjectRepository(DictionaryEnum)
    private readonly dictionaryEnumRepository: Repository<DictionaryEnum>,
  ) {}

  /**
   * 创建字典枚举
   */
  create(dictionaryEnum: CreateDictionaryEnumInput) {
    return this.dictionaryEnumRepository.save(
      this.dictionaryEnumRepository.create(dictionaryEnum),
    );
  }

  /**
   * 分页查询字典枚举
   */
  getDictionaryEnums(query?: QueryParams) {
    return paginateQuery(this.dictionaryEnumRepository, query);
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
  async update(id: number, dictionaryEnum: UpdateDictionaryEnumInput) {
    return !!(
      await this.dictionaryEnumRepository
        .createQueryBuilder()
        .update()
        .set({
          ...dictionaryEnum,
        })
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
