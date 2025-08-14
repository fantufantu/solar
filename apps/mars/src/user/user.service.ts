import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '@/libs/database/entities/mars/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * @description 收藏简历模板
   */
  async starResumeTemplate(code: string, who: number) {
    const _user =
      (await this.userRepository.findOneBy({ id: who })) ??
      this.userRepository.create({
        id: who,
        starredResumeTemplateCodes: [],
      });

    const _starred = new Set(_user.starredResumeTemplateCodes);
    if (_starred.has(code)) {
      return true;
    }

    _starred.add(code);
    _user.starredResumeTemplateCodes = Array.from(_starred);
    return !!(await this.userRepository.save(_user));
  }

  /**
   * @description 取消收藏简历模板
   */
  async unstarResumeTemplate(code: string, who: number) {
    const _user =
      (await this.userRepository.findOneBy({ id: who })) ??
      this.userRepository.create({
        id: who,
        starredResumeTemplateCodes: [],
      });

    const _starred = new Set(_user.starredResumeTemplateCodes);
    if (!_starred.has(code)) {
      return true;
    }

    _starred.delete(code);
    _user.starredResumeTemplateCodes = Array.from(_starred);
    return !!(await this.userRepository.save(_user));
  }
}
