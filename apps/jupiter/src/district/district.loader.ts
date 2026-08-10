import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { District } from '@/libs/database/entities/jupiter/district.entity';

@Injectable()
export class DistrictLoader {
  constructor(
    @InjectRepository(Attraction)
    private readonly attractionRepository: Repository<Attraction>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  /**
   * 根据行政区`code`批量统计关联景点数量，避免 N+1 查询问题
   */
  readonly attractionCount = new DataLoader<string, number>(
    async (codes: readonly string[]) => {
      const rows = await this.attractionRepository
        .createQueryBuilder('attraction')
        .select('attraction.districtCode', 'districtCode')
        .addSelect('COUNT(attraction.code)', 'count')
        .where('attraction.districtCode IN (:...codes)', { codes: [...codes] })
        .groupBy('attraction.districtCode')
        .getRawMany<{ districtCode: string; count: string }>();

      const counts = new Map(
        rows.map(({ districtCode, count }) => [districtCode, Number(count)]),
      );

      return codes.map((code) => counts.get(code) ?? 0);
    },
    {
      cache: false,
    },
  );

  /**
   * 根据父级行政区`code`批量查询子级行政区，避免 N+1 查询问题
   */
  readonly children = new DataLoader<string, District[]>(
    async (parentCodes: readonly string[]) => {
      const districts = await this.districtRepository.find({
        where: { parentCode: In(parentCodes) },
      });

      // 按 parentCode 分组
      const grouped = districts.reduce((map, district) => {
        if (district.parentCode) {
          const list = map.get(district.parentCode);
          if (list) {
            list.push(district);
          } else {
            map.set(district.parentCode, [district]);
          }
        }
        return map;
      }, new Map<string, District[]>());

      return parentCodes.map((code) => grouped.get(code) ?? []);
    },
    {
      cache: false,
    },
  );
}
