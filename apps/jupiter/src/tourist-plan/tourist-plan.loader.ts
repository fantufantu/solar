import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { District } from '@/libs/database/entities/jupiter/district.entity';
import { DistrictService } from '../district/district.service';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { AttractionService } from '../attraction/attraction.service';
import { TouristPlanItinerary } from '@/libs/database/entities/jupiter/tourist-plan-itinerary.entity';
import { TouristPlanItineraryService } from '../tourist-plan-itinerary/tourist-plan-itinerary.service';
import { toArray } from '@aiszlab/relax';

@Injectable()
export class TouristPlanLoader {
  constructor(
    private readonly districtService: DistrictService,
    private readonly attractionService: AttractionService,
    private readonly itineraryService: TouristPlanItineraryService,
  ) {}

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

  /**
   * @description
   * 根据景区`code`批量获取景区信息，避免 N+1 查询问题
   */
  public readonly attractions = new DataLoader<string, Attraction | null>(
    async (codes: readonly string[]) => {
      const attractions = new Map(
        (await this.attractionService.attractionsByCodes(toArray(codes))).map(
          (attraction) => [attraction.code, attraction],
        ),
      );

      return codes.map((code) => attractions.get(code) ?? null);
    },
    {
      cache: false,
    },
  );

  /**
   * @description
   * 根据出行方案`id`批量获取行程明细，避免 N+1 查询问题
   */
  public readonly itineraries = new DataLoader<string, TouristPlanItinerary[]>(
    async (touristPlanIds: readonly string[]) => {
      const allItineraries = await this.itineraryService.findByTouristPlanIds(
        toArray(touristPlanIds),
      );

      const grouped = allItineraries.reduce((prev, itinerary) => {
        const items = prev.get(itinerary.touristPlanId) ?? [];
        items.push(itinerary);
        return prev.set(itinerary.touristPlanId, items);
      }, new Map<string, TouristPlanItinerary[]>());

      return touristPlanIds.map((id) => grouped.get(id) ?? []);
    },
    {
      cache: false,
    },
  );
}
