import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SetDefaultBillingBy } from './dto/set-default-billing-by.input';
import { User } from '@/libs/database/entities/venus/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * @author murukal
   * @description 根据 id 查询用户信息
   */
  async getUserById(id: number) {
    return await this.userRepository.findOneBy({
      id,
    });
  }

  /**
   * @author murukal
   * @description 设置默认账本
   */
  async setDefaultBilling(
    setDefaultBillingBy: SetDefaultBillingBy,
    userId: number,
  ) {
    // 处理默认账本信息
    // 取消默认账本，账本 id = null
    const defaultBillingId = setDefaultBillingBy.isDefault
      ? setDefaultBillingBy.id
      : null;

    // 设置默认账本
    return !!(await this.userRepository.save(
      this.userRepository.create({
        id: userId,
        defaultBillingId,
      }),
    ));
  }
}
