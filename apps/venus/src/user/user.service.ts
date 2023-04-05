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
   * 切换默认账本
   * 切换账本是否默认
   */
  async setDefaultBilling(
    setDefaultBillingBy: SetDefaultBillingBy,
    userId: number,
  ) {
    // // 处理默认账本信息
    // // 取消默认账本，账本 id = null
    // const defaultBillingId = setDefaultArgs.isDefault
    //   ? setDefaultArgs.id
    //   : null;
    // // 更新用户信息
    // // 不存在 => 创建用户信息
    // return (
    //   (await this.update(userId, {
    //     defaultBillingId,
    //   })) ||
    //   !!(await this.create({
    //     id: userId,
    //     defaultBillingId,
    //   }))
    // );
  }
}
