import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TouristPlanItinerary } from '@/libs/database/entities/jupiter/tourist-plan-itinerary.entity';
import { CreateTouristPlanItineraryInput } from './dto/create-tourist-plan-itinerary.input';
import { UpdateTouristPlanItineraryInput } from './dto/update-tourist-plan-itinerary.input';

@Injectable()
export class TouristPlanItineraryService {
  constructor(
    @InjectRepository(TouristPlanItinerary)
    private readonly itineraryRepository: Repository<TouristPlanItinerary>,
  ) {}

  /**
   * 创建行程明细项
   */
  async create(
    input: CreateTouristPlanItineraryInput,
  ): Promise<TouristPlanItinerary> {
    return await this.itineraryRepository.save(
      this.itineraryRepository.create(input),
    );
  }

  /**
   * 更新行程明细项
   */
  async update(
    id: string,
    input: UpdateTouristPlanItineraryInput,
  ): Promise<TouristPlanItinerary> {
    await this.itineraryRepository.update(id, input);
    const item = await this.itineraryRepository.findOneBy({ id });
    if (!item) {
      throw new BadRequestException('Tourist plan itinerary not found');
    }
    return item;
  }

  /**
   * 删除行程明细项
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.itineraryRepository.delete(id);
    return result.affected === 1;
  }

  /**
   * 重新排序行程明细项
   */
  async reorder(
    touristPlanId: string,
    ids: string[],
  ): Promise<TouristPlanItinerary[]> {
    await Promise.all(
      ids.map((itemId, index) =>
        this.itineraryRepository.update(itemId, { sortOrder: index }),
      ),
    );

    return await this.itineraryRepository.find({
      where: { touristPlanId },
      order: { dayFrom: 'ASC', sortOrder: 'ASC' },
    });
  }

  /**
   * 根据出行方案`id`查询行程明细项
   */
  async findByTouristPlanId(
    touristPlanId: string,
  ): Promise<TouristPlanItinerary[]> {
    return await this.itineraryRepository.find({
      where: { touristPlanId },
      order: { dayFrom: 'ASC', sortOrder: 'ASC' },
    });
  }

  /**
   * 批量根据出行方案`id`查询行程明细项
   */
  async findByTouristPlanIds(
    touristPlanIds: readonly string[],
  ): Promise<TouristPlanItinerary[]> {
    return await this.itineraryRepository.find({
      where: touristPlanIds.map((id) => ({ touristPlanId: id })),
      order: { dayFrom: 'ASC', sortOrder: 'ASC' },
    });
  }

  /**
   * 批量保存行程明细项（用于从解析结果初始化）
   */
  async batchCreate(
    touristPlanId: string,
    items: Array<{
      dayFrom: number;
      sortOrder: number;
      name: string;
      description: string;
      tip: string;
      duration: number;
    }>,
  ): Promise<void> {
    const entities = items.map((item) =>
      this.itineraryRepository.create({
        ...item,
        touristPlanId,
      }),
    );
    await this.itineraryRepository.save(entities);
  }
}
