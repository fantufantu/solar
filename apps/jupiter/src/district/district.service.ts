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
      .andWhere('deletedAt IS NULL')
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
      .andWhere('deletedAt IS NULL')
      .getMany();
  }

  /**
   * 创建行政区
   *
   * 如果存在相同 code 的已删除记录，则恢复并更新数据
   */
  async create(input: CreateDistrictInput, createdById: string) {
    const existing = await this.districtRepository.findOne({
      where: { code: input.code },
      withDeleted: true,
    });

    if (existing) {
      // 已存在且未删除 → 创建失败
      if (!existing.deletedAt) return false;

      // 已删除 → 恢复并更新
      await this.districtRepository.recover(existing);
      await this.districtRepository.update(
        { code: input.code },
        this.districtRepository.create({ ...input, updatedById: createdById }),
      );
      return true;
    }

    // 不存在 → 新建
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

  /**
   * 删除行政区（软删除）
   */
  async delete(code: string, deletedById: string) {
    const district = await this.districtRepository.findOneBy({ code });
    if (!district) return false;

    district.deletedById = deletedById;
    await this.districtRepository.save(district);
    return true;
  }
}
