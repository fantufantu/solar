import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from '@/libs/database/entities/jupiter/district.entity';
import { Query } from 'typings/controller';
import { FilterDistrictsInput } from './dto/filter-districts.input';
import { UpdateDistrictInput } from './dto/update-district.input';
import { CreateDistrictInput } from './dto/create-district.input';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  /**
   * 分页查询行政区
   */
  async districts({
    pagination: { limit, page } = { limit: 10, page: 1 },
    filter: { keyword } = {},
  }: Query<FilterDistrictsInput>) {
    const _queryBuilder = this.districtRepository.createQueryBuilder();

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
   * 查询行政区
   */
  async district(code: string) {
    return await this.districtRepository.findOneBy({ code });
  }

  /**
   * 批量查询行政区（用于 DataLoader 批处理，避免 N+1 问题）
   */
  async districtsByCodes(codes: string[]): Promise<District[]> {
    return await this.districtRepository
      .createQueryBuilder()
      .where('code IN (:...codes)', { codes })
      .getMany();
  }

  /**
   * 创建行政区
   */
  async create(input: CreateDistrictInput, createdById: string) {
    return !!(
      await this.districtRepository
        .createQueryBuilder()
        .insert()
        .values(this.districtRepository.create({ ...input, createdById }))
        .execute()
    ).identifiers.length;
  }

  /**
   * 更新行政区
   */
  async update(code: string, input: UpdateDistrictInput, updatedById: string) {
    return !!(
      await this.districtRepository
        .createQueryBuilder()
        .update(this.districtRepository.create({ ...input, updatedById }))
        .where({ code })
        .execute()
    ).affected;
  }
}
