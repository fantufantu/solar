import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { District } from '@/libs/database/entities/jupiter/district.entity';
import { DistrictService } from '../district/district.service';
import { toArray } from '@aiszlab/relax';

@Injectable()
export class AttractionLoader {
  constructor(private readonly districtService: DistrictService) {}

  /**
   * @description
   * 根据行政区`code`批量获取行政区信息，避免 N+1 查询问题
   */
  public readonly districts = new DataLoader<string, District | null>(
    async (codes: readonly string[]) => {
      const districts = new Map(
        (await this.districtService.districtsByCodes(toArray(codes))).map(
          (district) => [district.code, district],
        ),
      );

      return codes.map((code) => districts.get(code) ?? null);
    },
    {
      cache: false,
    },
  );
}
