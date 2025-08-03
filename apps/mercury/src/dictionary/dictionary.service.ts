import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Dictionary } from '@/libs/database/entities/mercury/dictionary.entity';
import { paginateQuery } from 'utils/query-builder';
import type { CreateDictionaryInput } from './dto/create-dictionary.input';
import type { Query } from 'typings/controller';
import type { UpdateDictionaryInput } from './dto/update-dictionary.input';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private readonly dictionaryRepository: Repository<Dictionary>,
  ) {}

  /**
   * @description 创建字典
   */
  create(input: CreateDictionaryInput) {
    return this.dictionaryRepository.save(
      this.dictionaryRepository.create(input),
    );
  }

  /**
   * @description 分页查询字典
   */
  getDictionaries(query?: Query<Dictionary>) {
    return paginateQuery(this.dictionaryRepository, query);
  }

  /**
   * @description 查询单个字典
   */
  dictionay(code: string) {
    return this.dictionaryRepository.findOneBy({ code });
  }

  /**
   * 更新字典
   */
  async update(id: number, input: UpdateDictionaryInput) {
    return !!(
      await this.dictionaryRepository
        .createQueryBuilder()
        .update()
        .set(this.dictionaryRepository.create(input))
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
