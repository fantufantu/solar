// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { Repository } from 'typeorm';
// project
import { CreateSharingBy } from './dto/create-sharing-by.input';
import { FilterSharingBy } from './dto/filter-sharing-by.input';
import { RemoveSharingBy } from './dto/remove-sharing-by.input';
import { Sharing } from './entities/sharing.entity';

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
    // 删除已经存在的分享
    await this.remove({
      targetType: createSharingBy.targetType,
      targetId: createSharingBy.targetId,
    });

    // 存储分享
    return !!(await this.sharingRepository.save(
      createSharingBy.sharedByIds.map((sharedById) =>
        this.sharingRepository.create({
          sharedById,
          targetId: createSharingBy.targetId,
          targetType: createSharingBy.targetType,
        }),
      ),
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
  async getSharings(filterBy: FilterSharingBy) {
    return await this.sharingRepository
      .createQueryBuilder()
      .where('targetType = :targetType', {
        targetType: filterBy.targetType,
      })
      .andWhere('targetId IN (:...targetIds)', {
        targetIds: filterBy.targetIds,
      })
      .getMany();
  }
}
