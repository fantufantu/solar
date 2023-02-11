// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { Repository } from 'typeorm';
// project
import { CreateSharingInput } from './dto/create-sharing.input';
import { FilterSharingArgs } from './dto/filter-sharing.args';
import { RemoveSharingInput } from './dto/remove-sharing.input';
import { Sharing } from './entities/sharing.entity';

@Injectable()
export class SharingService {
  constructor(
    @InjectRepository(Sharing)
    private readonly sharingRepository: Repository<Sharing>,
  ) {}

  /**
   * 分享
   * @param createSharingInput
   * @returns
   */
  async create(createSharingInput: CreateSharingInput) {
    // 删除已经存在的分享
    await this.remove({
      targetType: createSharingInput.targetType,
      targetId: createSharingInput.targetId,
    });

    // 存储分享
    return await this.sharingRepository.save(
      createSharingInput.sharedByIds.map((sharedById) =>
        this.sharingRepository.create({
          sharedById,
          targetId: createSharingInput.targetId,
          targetType: createSharingInput.targetType,
        }),
      ),
    );
  }

  /**
   * 删除分享
   * @param removeSharingInput
   * @returns
   */
  async remove(removeSharingInput: RemoveSharingInput) {
    const qb = this.sharingRepository
      .createQueryBuilder()
      .delete()
      .where('targetId = :targetId', {
        targetId: removeSharingInput.targetId,
      })
      .andWhere('targetType = :targetType', {
        targetType: removeSharingInput.targetType,
      });

    if (removeSharingInput.sharedById) {
      qb.andWhere('sharedById = :sharedById', {
        sharedById: removeSharingInput.sharedById,
      });
    }

    return (await qb.execute()).affected > 0;
  }

  /**
   * 查询分享列表
   * @param args
   * @returns
   */
  async getSharings(args: FilterSharingArgs) {
    return await this.sharingRepository
      .createQueryBuilder()
      .where('targetType = :targetType', {
        targetType: args.targetType,
      })
      .andWhere('targetId IN (:...targetIds)', {
        targetIds: args.targetIds,
      })
      .getMany();
  }
}
