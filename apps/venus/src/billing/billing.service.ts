// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { Repository } from 'typeorm';
// project
import { Share, TargetType } from '../share/entities/share.entity';
import { ShareService } from '../share/share.service';
import { UserService } from '../user/user.service';
import { CreateBillingInput } from './dto/create-billing.input';
import { SetDefaultArgs } from './dto/set-default.args';
import { UpdateBillingInput } from './dto/update-billing.input';
import { Billing } from './entities/billing.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing)
    private readonly billingRepository: Repository<Billing>,
    private readonly shareService: ShareService,
    private readonly userService: UserService,
  ) {}

  /**
   * 创建账本
   */
  create(createBillingInput: CreateBillingInput, createdById: number) {
    return this.billingRepository.save(
      this.billingRepository.create({
        ...createBillingInput,
        createdById,
      }),
    );
  }

  /**
   * 查询多个账本
   */
  async getBillings(userId: number) {
    return await this.billingRepository
      .createQueryBuilder('billing')
      .leftJoinAndSelect(
        Share,
        'share',
        'share.targetType = :targetType AND share.targetId = billing.id',
        {
          targetType: TargetType.Billing,
        },
      )
      .where('isDeleted = :isDeleted', {
        isDeleted: false,
      })
      .andWhere(
        '( billing.createdById = :userId OR share.sharedById = :userId )',
        {
          userId,
        },
      )
      .getMany();
  }

  /**
   * 查询单个账本
   */
  getBilling(id: number, userId: number) {
    return this.billingRepository
      .createQueryBuilder('billing')
      .leftJoinAndSelect(
        Share,
        'share',
        'share.targetType = :targetType AND share.targetId = billing.id',
        {
          targetType: TargetType.Billing,
        },
      )
      .whereInIds(id)
      .andWhere('isDeleted = :isDeleted', {
        isDeleted: false,
      })
      .andWhere(
        '( billing.createdById = :userId OR share.sharedById = :userId )',
        {
          userId,
        },
      )
      .getOne();
  }

  /**
   * 更新账本信息
   */
  update(id: number, updateBillingInput: UpdateBillingInput) {
    return this.billingRepository.update(id, updateBillingInput);
  }

  /**
   * 删除账本信息
   * 操作人为账本所有人，删除账本的所有分享，删除账本
   * 操作人非账本所有人，仅删除账本的相关分享
   */
  async remove(id: number, userId: number) {
    const billing = await this.billingRepository.findOneBy({
      id,
      isDeleted: false,
    });

    if (!billing) {
      return true;
    }

    const isMine = billing.createdById === userId;

    // 删除分享
    // 账本创建人，删除当前账本的全部分享 -> 删除账本
    // 非账本创建人，仅删除当前账本的被分享条目即可
    const isShareRemoved = await this.shareService.remove({
      targetId: id,
      targetType: TargetType.Billing,
      sharedById: isMine ? undefined : userId,
    });

    if (!isMine) return isShareRemoved;

    // 分享删除成功执行删除账本
    return (
      isShareRemoved &&
      !!(
        await this.billingRepository.update(id, {
          isDeleted: true,
        })
      ).affected
    );
  }

  /**
   * 切换默认账本
   * 切换账本是否默认
   */
  async setDefault(setDefaultArgs: SetDefaultArgs, userId: number) {
    // 处理默认账本信息
    // 取消默认账本，账本 id = null
    const defaultBillingId = setDefaultArgs.isDefault
      ? setDefaultArgs.id
      : null;

    // 更新用户信息
    // 不存在 => 创建用户信息
    return (
      (await this.userService.update(userId, {
        defaultBillingId,
      })) ||
      !!(await this.userService.create({
        id: userId,
        defaultBillingId,
      }))
    );
  }
}
