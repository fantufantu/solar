import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DataLoader from 'dataloader';
import { Repository } from 'typeorm';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';

@Injectable()
export class DistrictLoader {
  constructor(
    @InjectRepository(Attraction)
    private readonly attractionRepository: Repository<Attraction>,
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
}
