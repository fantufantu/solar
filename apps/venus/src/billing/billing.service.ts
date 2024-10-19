import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  Sharing,
  TargetType,
} from '@/libs/database/entities/venus/sharing.entity';
import { SharingService } from '../sharing/sharing.service';
import { CreateBillingBy } from './dto/create-billing-by.input';
import { UpdateBillingBy } from './dto/update-billing-by.input';
import { Billing } from '@/libs/database/entities/venus/billing.entity';
import { SetBillingLimitBy } from './dto/set-billing-limit-by.input';

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
  create(createBillingBy: CreateBillingBy, createdById: number) {
    return this.billingRepository.save(
      this.billingRepository.create({
        ...createBillingBy,
        createdById,
      }),
    );
  }

  /**
   * @author murukal
   * @description 查询指定用户 id 相关的账本列表
   */
  async getBillingsByUserId(userId: number) {
    return await this.billingRepository
      .createQueryBuilder('billing')
      .leftJoinAndSelect(
        Sharing,
        'sharing',
        'sharing.targetType = :targetType AND sharing.targetId = billing.id',
        {
          targetType: TargetType.Billing,
        },
      )
      .where(
        '( billing.createdById = :userId OR sharing.sharedById = :userId )',
        {
          userId,
        },
      )
      .getManyAndCount();
  }

  /**
   * @author murukal
   * @description 查询单个账本
   */
  getBilling(id: number, userId: number) {
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
  update(id: number, updateBillingBy: UpdateBillingBy) {
    return this.billingRepository.update(
      id,
      this.billingRepository.create(updateBillingBy),
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
  async getBillingsByIds(ids: number[]): Promise<Billing[]> {
    if (ids.length === 0) return [];

    return await this.billingRepository.findBy({
      id: In(ids),
    });
  }

  /**
   * @author murukal
   * @description 设置账本限额
   */
  async setLimit(id: number, setBy: SetBillingLimitBy) {
    return !!(await this.billingRepository.update(id, setBy)).affected;
  }
}
