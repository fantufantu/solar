import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '@/libs/database/entities/jupiter/city.entity';
import { Query } from 'typings/controller';
import { FilterCitiesInput } from './dto/filter-cities.input';
import { UpdateCityInput } from './dto/update-city.input';
import { CreateCityInput } from './dto/create-city.input';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  /**
   * 分页查询城市
   */
  async cities({
    pagination: { limit, page } = { limit: 10, page: 1 },
    filter: { keyword } = {},
  }: Query<FilterCitiesInput>) {
    const _queryBuilder = this.cityRepository.createQueryBuilder();

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
   * 查询城市
   */
  async city(code: string) {
    return await this.cityRepository.findOneBy({ code });
  }

  /**
   * 批量查询城市（用于 DataLoader 批处理，避免 N+1 问题）
   */
  async citiesByCodes(codes: string[]): Promise<City[]> {
    return await this.cityRepository
      .createQueryBuilder()
      .where('code IN (:...codes)', { codes })
      .getMany();
  }

  /**
   * 创建城市
   */
  async create(input: CreateCityInput, createdById: number) {
    return !!(
      await this.cityRepository
        .createQueryBuilder()
        .insert()
        .values(this.cityRepository.create({ ...input, createdById }))
        .execute()
    ).identifiers.length;
  }

  /**
   * 更新城市
   */
  async update(code: string, input: UpdateCityInput, updatedById: number) {
    return !!(
      await this.cityRepository
        .createQueryBuilder()
        .update(this.cityRepository.create({ ...input, updatedById }))
        .where({ code })
        .execute()
    ).affected;
  }
}
