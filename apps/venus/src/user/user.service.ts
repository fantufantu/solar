// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { Repository } from 'typeorm';
// project
import { CreateUserInput } from './dto/create-user.input';
import { SetDefaultArgs } from './dto/set-default.args';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 查询用户信息
   * @param id
   * @returns
   */
  getUser(id: number) {
    return this.userRepository.findOneBy({
      id,
    });
  }

  /**
   * 创建用户信息
   * @param createUserInput
   * @returns
   */
  create(createUserInput: CreateUserInput) {
    return this.userRepository.save(
      this.userRepository.create(createUserInput),
    );
  }

  /**
   * 更新用户信息
   * @param id
   * @param updateUserProfileInput
   * @returns
   */
  async update(id: number, updateUserInput: UpdateUserInput) {
    return (await this.userRepository.update(id, updateUserInput)).affected > 0;
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
      (await this.update(userId, {
        defaultBillingId,
      })) ||
      !!(await this.create({
        id: userId,
        defaultBillingId,
      }))
    );
  }
}
