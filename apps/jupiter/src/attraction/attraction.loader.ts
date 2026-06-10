import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { City } from '@/libs/database/entities/jupiter/city.entity';
import { CityService } from '../city/city.service';
import { toArray } from '@aiszlab/relax';

@Injectable()
export class AttractionLoader {
  constructor(private readonly cityService: CityService) {}

  /**
   * @description
   * 根据城市`code`批量获取城市信息，避免 N+1 查询问题
   */
  public readonly cities = new DataLoader<string, City | null>(
    async (codes: readonly string[]) => {
      const cities = new Map(
        (await this.cityService.citiesByCodes(toArray(codes))).map((city) => [
          city.code,
          city,
        ]),
      );

      return codes.map((code) => cities.get(code) ?? null);
    },
    {
      cache: false,
    },
  );
}
