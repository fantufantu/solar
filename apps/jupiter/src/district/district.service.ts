import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { District } from '@/libs/database/entities/jupiter/district.entity';
import { Query } from 'typings/controller';
import { FilterDistrictsInput } from './dto/filter-districts.input';
import { UpdateDistrictInput } from './dto/update-district.input';
import { CreateDistrictInput } from './dto/create-district.input';
import {
  DISTRICT_SYNC_ACTION,
  SyncDistrictsInput,
} from './dto/sync-districts.input';

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
    const _queryBuilder =
      this.districtRepository.createQueryBuilder('district');

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
      .andWhere('district.deletedAt IS NULL')
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
      .createQueryBuilder('district')
      .where('code IN (:...codes)', { codes })
      .andWhere('district.deletedAt IS NULL')
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
      if (!existing.deletedAt) {
        throw new ConflictException(`District ${input.code} already exists`);
      }

      // 已删除 → 恢复并更新
      Object.assign(existing, input, {
        updatedById: createdById,
      });
      await this.districtRepository.recover(existing);
      await this.districtRepository.save(existing);
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
    const district = await this.districtRepository.findOneBy({ code });
    if (!district) throw new NotFoundException(`District ${code} not found`);

    Object.assign(district, input, { updatedById });
    await this.districtRepository.save(district);
    return true;
  }

  /**
   * 删除行政区（软删除）
   */
  async delete(code: string, deletedById: string) {
    const district = await this.districtRepository.findOneBy({ code });
    if (!district) throw new NotFoundException(`District ${code} not found`);

    district.deletedById = deletedById;
    await this.districtRepository.softRemove(district);
    return true;
  }

  /** 批量同步行政区。 */
  async sync({ items }: SyncDistrictsInput, userId: string) {
    if (!items.length)
      throw new BadRequestException('District sync list is empty');

    const codes = new Set<string>();
    for (const item of items) {
      if (codes.has(item.code)) {
        throw new BadRequestException(
          `Duplicate or conflicting operations for district ${item.code}`,
        );
      }
      codes.add(item.code);
    }

    const existingDistricts = await this.districtRepository.find({
      where: { code: In([...codes]) },
      withDeleted: true,
    });

    const existingByCode = new Map(
      existingDistricts.map((district) => [district.code, district]),
    );

    const districtsToUpsert: District[] = [];
    const codesToDelete: string[] = [];

    for (const item of items) {
      const { action, code, ...fields } = item;
      const existing = existingByCode.get(code);
      switch (action) {
        case DISTRICT_SYNC_ACTION.CREATE: {
          if (existing && !existing.deletedAt) {
            throw new ConflictException(`District ${code} already exists`);
          }

          districtsToUpsert.push(
            this.districtRepository.create({
              ...existing,
              ...fields,
              code,
              createdById: existing?.createdById ?? userId,
              updatedById: userId,
              deletedAt: null,
            }),
          );

          break;
        }
        case DISTRICT_SYNC_ACTION.UPDATE: {
          if (!existing || existing.deletedAt) {
            throw new NotFoundException(`District ${code} not found`);
          }

          districtsToUpsert.push(
            this.districtRepository.create({
              ...existing,
              ...fields,
              updatedById: userId,
            }),
          );

          break;
        }
        case DISTRICT_SYNC_ACTION.DELETE:
          if (!existing || existing.deletedAt) {
            throw new NotFoundException(`District ${code} not found`);
          }

          codesToDelete.push(code);

          break;
        default:
          throw new BadRequestException(
            `Unsupported district sync action: ${action}`,
          );
      }
    }

    if (districtsToUpsert.length > 0) {
      await this.districtRepository.upsert(districtsToUpsert, ['code']);
    }

    if (codesToDelete.length > 0) {
      await this.districtRepository.update(
        { code: In(codesToDelete) },
        { deletedAt: new Date(), updatedById: userId },
      );
    }

    return true;
  }
}
