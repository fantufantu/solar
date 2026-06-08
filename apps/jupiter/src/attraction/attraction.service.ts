import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { Query } from 'typings/controller';
import { FilterAttractionsInput } from './dto/filter-attractions.input';
import { UpdateAttractionInput } from './dto/update-attraction.input';
import { CreateAttractionInput } from './dto/create-attraction.input';

@Injectable()
export class AttractionService {
  constructor(
    @InjectRepository(Attraction)
    private readonly attractionRepository: Repository<Attraction>,
  ) {}

  /**
   * 分页查询景点
   */
  async attractions({
    pagination: { limit, page } = { limit: 10, page: 1 },
    filter: { keyword } = {},
  }: Query<FilterAttractionsInput>) {
    const _queryBuilder = this.attractionRepository.createQueryBuilder();

    if (keyword) {
      _queryBuilder
        .where('code REGEXP :code')
        .orWhere('name REGEXP :name')
        .setParameters({
          code: keyword,
          name: keyword,
        });
    }

    return await _queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  /**
   * 查询景点
   */
  async attraction(code: string) {
    return await this.attractionRepository.findOneBy({ code });
  }

  /**
   * 批量查询景点（用于 DataLoader 批处理，避免 N+1 问题）
   */
  async attractionsByCodes(codes: string[]): Promise<Attraction[]> {
    return await this.attractionRepository
      .createQueryBuilder()
      .where('code IN (:...codes)', { codes })
      .getMany();
  }

  /**
   * 创建景点
   */
  async create(input: CreateAttractionInput, createdById: number) {
    return !!(
      await this.attractionRepository
        .createQueryBuilder()
        .insert()
        .values(this.attractionRepository.create({ ...input, createdById }))
        .execute()
    ).identifiers.length;
  }

  /**
   * 更新景点
   */
  async update(code: string, input: UpdateAttractionInput, updatedById: number) {
    return !!(
      await this.attractionRepository
        .createQueryBuilder()
        .update(this.attractionRepository.create({ ...input, updatedById }))
        .where({ code })
        .execute()
    ).affected;
  }
}
