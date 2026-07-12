import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/libs/database/entities/jupiter/user.entity';
import { Between, Repository } from 'typeorm';
import dayjs from 'dayjs';
import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { MercuryClientService } from '@/libs/mercury-client';
import { isVoid } from '@aiszlab/relax';
import { UserMembership } from './dto/user-membership.object';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TouristPlan)
    private readonly touristPlanRepository: Repository<TouristPlan>,
    private readonly mercuryClient: MercuryClientService,
  ) {}

  /**
   * 根据`id`查询用户信息
   */
  async user(id: string) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  /**
   * 升级用户会员等级
   */
  async upgradeMembership(userId: string, membershipId: number) {
    const { affected } = await this.userRepository.update(userId, {
      membershipId,
    });
    return (affected ?? 0) > 0;
  }

  /**
   * 获取用户当前总额度（来自会员等级，免费用户默认为 3）
   */
  async membership(userId?: string): Promise<UserMembership> {
    const user = !isVoid(userId)
      ? await this.userRepository.findOne({
          where: { id: userId },
          relations: ['membership'],
        })
      : null;

    return {
      name: user?.membership?.name ?? '免费用户',
      quota: user?.membership?.quota ?? 3,
    };
  }

  /**
   * 检查用户今日是否已达配额上限
   */
  async isQuotaOverflow(belongToId: string) {
    const _user = await this.mercuryClient.getUser({ id: belongToId });
    const _quota = (await this.membership(_user?.id)).quota;
    const _usedQuota = await this.usedQuota(belongToId);

    if (_usedQuota >= _quota) {
      throw new BadRequestException(
        `今日出行计划创建次数已达上限（${_quota}次），请明日再试`,
      );
    }
  }

  /**
   * 批量获取用户今日已创建的出行计划总数
   * 用户今日已使用额度
   */
  async usedQuota(belongToId: string): Promise<number> {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();

    const count = await this.touristPlanRepository.countBy({
      belongToId,
      createdAt: Between(todayStart, todayEnd),
    });
    return count;
  }
}
