// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { Repository } from 'typeorm';
// project
import { CreateUserProfileInput } from './dto/create-user-profile.input';
import { UpdateUserProfileInput } from './dto/update-user-profile.input';
import { UserProfile } from './entities/user-profile.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  /**
   * 查询用户信息
   * @param userId
   * @returns
   */
  getUserProfile(userId: number) {
    return this.userProfileRepository.findOneBy({
      userId,
    });
  }

  /**
   * 创建用户信息
   * @param createUserProfileInput
   * @returns
   */
  create(createUserProfileInput: CreateUserProfileInput) {
    return this.userProfileRepository.save(
      this.userProfileRepository.create(createUserProfileInput),
    );
  }

  /**
   * 更新用户信息
   * @param userId
   * @param updateUserProfileInput
   * @returns
   */
  async update(userId: number, updateUserProfileInput: UpdateUserProfileInput) {
    const updated = await this.userProfileRepository.update(
      userId,
      updateUserProfileInput,
    );

    return updated.affected > 0;
  }
}
