// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { Repository } from 'typeorm';
// project
import { CreateShareInput } from './dto/create-share.input';
import { GetSharesArgs } from './dto/get-shares.args';
import { RemoveShareInput } from './dto/remove-share.input';
import { Share } from './entities/share.entity';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(Share)
    private readonly shareRepository: Repository<Share>,
  ) {}

  /**
   * 分享
   * @param createShareInput
   * @returns
   */
  async create(createShareInput: CreateShareInput): Promise<Share[]> {
    // 删除已经存在的分享
    await this.remove({
      targetType: createShareInput.targetType,
      targetId: createShareInput.targetId,
    });

    // 存储分享
    return await this.shareRepository.save(
      createShareInput.sharedByIds.map((sharedById) =>
        this.shareRepository.create({
          sharedById,
          targetId: createShareInput.targetId,
          targetType: createShareInput.targetType,
        }),
      ),
    );
  }

  /**
   * 删除分享
   * @param removeShareInput
   * @returns
   */
  async remove(removeShareInput: RemoveShareInput) {
    const qb = this.shareRepository
      .createQueryBuilder()
      .delete()
      .where('targetId = :targetId', {
        targetId: removeShareInput.targetId,
      })
      .andWhere('targetType = :targetType', {
        targetType: removeShareInput.targetType,
      });

    if (removeShareInput.sharedById) {
      qb.andWhere('sharedById = :sharedById', {
        sharedById: removeShareInput.sharedById,
      });
    }

    return (await qb.execute()).affected > 0;
  }

  /**
   * 查询分享列表
   * @param args
   * @returns
   */
  async getShares(args: GetSharesArgs) {
    return await this.shareRepository
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
