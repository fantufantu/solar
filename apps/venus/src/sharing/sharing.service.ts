import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSharingInput } from './dto/create-sharing.input';
import { FilterSharingsInput } from './dto/filter-sharings.input';
import { RemoveSharingInput } from './dto/remove-sharing.input';
import { Sharing } from '@/libs/database/entities/venus/sharing.entity';

@Injectable()
export class SharingService {
  constructor(
    @InjectRepository(Sharing)
    private readonly sharingRepository: Repository<Sharing>,
  ) {}

  /**
   * @author murukal
   * @description 分享
   */
  async create(input: CreateSharingInput) {
    return !!(await this.sharingRepository.save(
      this.sharingRepository.create(input),
    ));
  }

  /**
   * @author murukal
   * @description 删除分享
   */
  async remove(input: RemoveSharingInput) {
    const qb = this.sharingRepository
      .createQueryBuilder()
      .delete()
      .where('targetId = :targetId', {
        targetId: input.targetId,
      })
      .andWhere('targetType = :targetType', {
        targetType: input.targetType,
      });

    if (input.sharedById) {
      qb.andWhere('sharedById = :sharedById', {
        sharedById: input.sharedById,
      });
    }

    return !!(await qb.execute()).affected;
  }

  /**
   * @author murukal
   * @description 查询分享列表
   */
  async sharings({ targetIds, targetType }: FilterSharingsInput) {
    return await this.sharingRepository
      .createQueryBuilder()
      .where('targetType = :targetType', {
        targetType,
      })
      .andWhere('targetId IN (:...targetIds)', {
        targetIds,
      })
      .getMany();
  }
}
