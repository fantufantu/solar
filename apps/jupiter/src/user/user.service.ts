import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/libs/database/entities/jupiter/user.entity';
import { Between, Repository } from 'typeorm';
import dayjs from 'dayjs';
import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { MercuryClientService } from '@/libs/mercury-client';

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
  async user(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  /**
   * 升级用户会员等级
   */
  async upgradeMembership(userId: number, membershipId: number) {
    const { affected } = await this.userRepository.update(userId, {
      membershipId,
    });
    return (affected ?? 0) > 0;
  }

  /**
   * 检查用户今日是否已达配额上限
   */
  async isQuotaOverflow(belongToId: string) {
    const userId = (
      await this.mercuryClient.getUser({
        username: belongToId,
      })
    )?.id;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['membership'],
    });

    const quota = user?.membership?.quota ?? 3;
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();

    const count = await this.touristPlanRepository.countBy({
      belongToId,
      createdAt: Between(todayStart, todayEnd),
    });

    if (count >= quota) {
      throw new BadRequestException(
        `今日出行计划创建次数已达上限（${quota}次），请明日再试`,
      );
    }
  }
}
