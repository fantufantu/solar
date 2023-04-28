// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { Repository } from 'typeorm';
// project
import { SetDefaultBillingBy } from './dto/set-default-billing-by.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 根据 id 查询用户信息
   * @param id
   * @returns
   */
  async getUserById(id: number) {
    return await this.userRepository.findOneBy({
      id,
    });
  }

  /**
   * 设置默认账本
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
