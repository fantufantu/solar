import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import {
  Sharing,
  TARGET_TYPE,
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
  create(input: CreateBillingInput, createdById: string) {
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
  billing(id: number, userId: string) {
    return this.billingRepository
      .createQueryBuilder('billing')
      .leftJoinAndSelect(
        Sharing,
        'sharing',
        'sharing.targetType = :targetType AND sharing.targetId = billing.id',
        {
          targetType: TARGET_TYPE.BILLING,
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
  async update(id: number, input: UpdateBillingInput, userId: string) {
    await this.assertOwnership(id, userId);
    return this.billingRepository.update(
      id,
      this.billingRepository.create(input),
    );
  }

  /**
   * @author murukal
   * @description 删除账本信息
   */
  async remove(id: number, userId: string) {
    const billing = await this.billingRepository.findOneBy({
      id,
    });

    if (!billing) {
      return true;
    }

    if (billing.createdById !== userId) {
      throw new ForbiddenException('您没有权限操作该账本！');
    }

    // 删除分享
    const isSharingRemoved = await this.sharingService.remove({
      targetId: id,
      targetType: TARGET_TYPE.BILLING,
    });

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
    who?: string;
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
          targetType: TARGET_TYPE.BILLING,
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
  async updateLimitation(
    id: number,
    input: UpdateBillingLimitationInput,
    userId: string,
  ) {
    await this.assertOwnership(id, userId);
    return ((await this.billingRepository.update(id, input)).affected ?? 0) > 0;
  }

  private async assertOwnership(id: number, userId: string) {
    const billing = await this.billingRepository.findOneBy({ id });

    if (billing && billing.createdById !== userId) {
      throw new ForbiddenException('您没有权限操作该账本！');
    }
  }
}
