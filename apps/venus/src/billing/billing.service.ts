import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository } from 'typeorm';
import {
  Sharing,
  TargetType,
} from '@/libs/database/entities/venus/sharing.entity';
import { SharingService } from '../sharing/sharing.service';
import { CreateBillingInput } from './dto/create-billing.input';
import { UpdateBillingInput } from './dto/update-billing.input';
import { Billing } from '@/libs/database/entities/venus/billing.entity';
import { UpdateBillingLimitationInput } from './dto/update-billing-limitation.input';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing)
    private readonly billingRepository: Repository<Billing>,
    private readonly sharingService: SharingService,
  ) {}

  /**
   * @author murukal
   * @description 创建账本
   */
  create(input: CreateBillingInput, createdById: number) {
    return this.billingRepository.save(
      this.billingRepository.create({
        ...input,
        createdById,
      }),
    );
  }

  /**
   * @author murukal
   * @description 查询单个账本
   */
  billing(id: number, userId: number) {
    return this.billingRepository
      .createQueryBuilder('billing')
      .leftJoinAndSelect(
        Sharing,
        'sharing',
        'sharing.targetType = :targetType AND sharing.targetId = billing.id',
        {
          targetType: TargetType.Billing,
        },
      )
      .whereInIds(id)
      .andWhere(
        '( billing.createdById = :userId OR sharing.sharedById = :userId )',
        {
          userId,
        },
      )
      .getOne();
  }

  /**
   * @author murukal
   * @description 更新账本信息
   */
  update(id: number, input: UpdateBillingInput) {
    return this.billingRepository.update(
      id,
      this.billingRepository.create(input),
    );
  }

  /**
   * @author murukal
   * @description 删除账本信息
   */
  async remove(id: number, userId: number) {
    const billing = await this.billingRepository.findOneBy({
      id,
    });

    if (!billing) {
      return true;
    }

    const isMine = billing.createdById === userId;

    // 删除分享
    // 账本创建人，删除当前账本的全部分享 -> 删除账本
    // 非账本创建人，仅删除当前账本的被分享条目即可
    const isSharingRemoved = await this.sharingService.remove({
      targetId: id,
      targetType: TargetType.Billing,
      sharedById: isMine ? undefined : userId,
    });

    if (!isMine) return isSharingRemoved;

    // 分享删除成功执行删除账本
    return (
      isSharingRemoved &&
      !!(await this.billingRepository.softDelete(id)).affected
    );
  }

  /**
   * @author murukal
   * @description 根据账本 id 列表，查询账本列表
   */
  async billings({
    ids = [],
    who,
  }: {
    ids?: number[];
    who?: number;
  }): Promise<Billing[]> {
    const qb = this.billingRepository
      .createQueryBuilder('billing')
      .where('1 = 1')
      .orderBy('billing.updatedAt', 'DESC');

    if (who) {
      qb.leftJoinAndSelect(
        Sharing,
        'sharing',
        'sharing.targetType = :targetType AND sharing.targetId = billing.id',
        {
          targetType: TargetType.Billing,
        },
      ).andWhere(
        new Brackets((qb) => {
          qb.where('billing.createdById = :who', { who }).orWhere(
            'sharing.sharedById = :who',
            { who },
          );
        }),
      );
    }

    if (ids.length > 0) {
      qb.andWhere('billing.id IN (:...ids)', { ids });
    }

    return await qb.getMany();
  }

  /**
   * @author murukal
   * @description 更新账本限额
   */
  async updateLimitation(id: number, input: UpdateBillingLimitationInput) {
    return ((await this.billingRepository.update(id, input)).affected ?? 0) > 0;
  }
}
