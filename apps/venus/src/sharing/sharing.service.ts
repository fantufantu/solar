import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSharingBy } from './dto/create-sharing-by.input';
import { FilterSharingsBy } from './dto/filter-sharings-by.input';
import { RemoveSharingBy } from './dto/remove-sharing-by.input';
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
  async create(createSharingBy: CreateSharingBy) {
    return !!(await this.sharingRepository.save(
      this.sharingRepository.create(createSharingBy),
    ));
  }

  /**
   * @author murukal
   * @description 删除分享
   */
  async remove(removeSharingBy: RemoveSharingBy) {
    const qb = this.sharingRepository
      .createQueryBuilder()
      .delete()
      .where('targetId = :targetId', {
        targetId: removeSharingBy.targetId,
      })
      .andWhere('targetType = :targetType', {
        targetType: removeSharingBy.targetType,
      });

    if (removeSharingBy.sharedById) {
      qb.andWhere('sharedById = :sharedById', {
        sharedById: removeSharingBy.sharedById,
      });
    }

    return !!(await qb.execute()).affected;
  }

  /**
   * @author murukal
   * @description 查询分享列表
   */
  async getSharings({ targetIds, targetType }: FilterSharingsBy) {
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
