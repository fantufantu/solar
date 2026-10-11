import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository } from 'typeorm';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { Query } from 'typings/controller';
import { FilterAttractionsInput } from './dto/filter-attractions.input';
import { UpdateAttractionInput } from './dto/update-attraction.input';
import { CreateAttractionInput } from './dto/create-attraction.input';
import {
  ATTRACTION_SYNC_ACTION,
  SyncAttractionsInput,
} from './dto/sync-attractions.input';

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
    filter: { keyword, districtCode } = {},
  }: Query<FilterAttractionsInput>) {
    const _queryBuilder = this.attractionRepository
      .createQueryBuilder()
      .where('1 = 1');

    if (districtCode) {
      _queryBuilder.andWhere('district_code = :districtCode', { districtCode });
    }

    if (keyword) {
      _queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('code REGEXP :keyword').orWhere('name REGEXP :keyword');
        }),
      );

      _queryBuilder.setParameters({
        keyword,
      });
    }

    return await _queryBuilder
      .orderBy('updated_at', 'DESC')
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
  async create(input: CreateAttractionInput, createdById: string) {
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
  async update(
    code: string,
    input: UpdateAttractionInput,
    updatedById: string,
  ) {
    return !!(
      await this.attractionRepository
        .createQueryBuilder()
        .update(this.attractionRepository.create({ ...input, updatedById }))
        .where({ code })
        .execute()
    ).affected;
  }

  /**
   * 硬删除景点
   */
  async delete(code: string) {
    return !!(
      await this.attractionRepository
        .createQueryBuilder()
        .delete()
        .where({ code })
        .execute()
    ).affected;
  }

  /** 批量硬删除景点 */
  async deleteMany(codes: string[]) {
    if (codes.length === 0) {
      throw new BadRequestException('Attraction codes must not be empty');
    }

    return !!(
      await this.attractionRepository
        .createQueryBuilder()
        .delete()
        .where({ code: In(codes) })
        .execute()
    ).affected;
  }

  /** 批量同步景点。 */
  async sync({ items }: SyncAttractionsInput, userId: string) {
    if (!items.length)
      throw new BadRequestException('Attraction sync list is empty');

    const codes = new Set<string>();
    for (const item of items) {
      if (codes.has(item.code)) {
        throw new BadRequestException(
          `Duplicate or conflicting operations for attraction ${item.code}`,
        );
      }
      codes.add(item.code);
    }

    const existingAttractions = await this.attractionRepository.find({
      where: { code: In([...codes]) },
    });
    const existingByCode = new Map(
      existingAttractions.map((attraction) => [attraction.code, attraction]),
    );

    const attractionsToUpsert: Attraction[] = [];
    const codesToDelete: string[] = [];

    for (const item of items) {
      const { action, code, ...fields } = item;
      const existing = existingByCode.get(code);
      switch (action) {
        case ATTRACTION_SYNC_ACTION.CREATE:
          attractionsToUpsert.push(
            this.attractionRepository.create({
              ...existing,
              ...fields,
              code,
              createdById: existing?.createdById ?? userId,
              updatedById: userId,
            }),
          );
          break;
        case ATTRACTION_SYNC_ACTION.UPDATE:
          if (!existing) {
            throw new NotFoundException(`Attraction ${code} not found`);
          }
          attractionsToUpsert.push(
            this.attractionRepository.create({
              ...existing,
              ...fields,
              updatedById: userId,
            }),
          );
          break;
        case ATTRACTION_SYNC_ACTION.DELETE:
          if (!existing) {
            throw new NotFoundException(`Attraction ${code} not found`);
          }
          codesToDelete.push(code);
          break;
        default:
          throw new BadRequestException(
            `Unsupported attraction sync action: ${action}`,
          );
      }
    }

    if (attractionsToUpsert.length > 0) {
      await this.attractionRepository.upsert(attractionsToUpsert, ['code']);
    }

    if (codesToDelete.length > 0) {
      await this.attractionRepository.delete({ code: In(codesToDelete) });
    }

    return true;
  }
}
