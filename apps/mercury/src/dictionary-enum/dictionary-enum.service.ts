import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { DictionaryEnum } from '@/libs/database/entities/mercury/dictionary-enum.entity';
import { paginateQuery } from 'utils/query-builder';
import type { Query } from 'typings/controller';
import type { CreateDictionaryEnumInput } from './dto/create-dictionary-enum.input';
import type { UpdateDictionaryEnumInput } from './dto/update-dictionary-enum.input';

@Injectable()
export class DictionaryEnumService {
  constructor(
    @InjectRepository(DictionaryEnum)
    private readonly dictionaryEnumRepository: Repository<DictionaryEnum>,
  ) {}

  /**
   * @description 创建字典枚举
   */
  create(input: CreateDictionaryEnumInput) {
    return this.dictionaryEnumRepository.save(
      this.dictionaryEnumRepository.create(input),
    );
  }

  /**
   * @description 分页查询字典枚举
   */
  dictionaryEnums(query?: Query<DictionaryEnum>) {
    return paginateQuery(this.dictionaryEnumRepository, query);
  }

  /**
   * @description 查询单个字典枚举
   */
  dictionaryEnum(id: number) {
    return this.dictionaryEnumRepository.findOneBy({ id });
  }

  /**
   * 更新单个字典枚举
   */
  async update(id: number, input: UpdateDictionaryEnumInput) {
    return !!(
      await this.dictionaryEnumRepository
        .createQueryBuilder()
        .update()
        .set(this.dictionaryEnumRepository.create(input))
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * @description 删除单个字典枚举
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
