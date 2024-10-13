import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CommandToken, ProviderToken } from 'assets/tokens';
import { User } from '@/lib/database/entities/mercury/user.entity';
import type { PermitBy } from 'assets/decorators';

@Injectable()
export class MercuryClientService {
  constructor(
    @Inject(ProviderToken.MercuryClientProxy)
    private readonly client: ClientProxy,
  ) {}

  /**
   * @description
   * 根据用户id获取用户信息
   */
  async getUserById(id: number) {
    return await lastValueFrom<User>(
      this.client.send(
        {
          cmd: CommandToken.GetUser,
        },
        id,
      ),
    );
  }

  /**
   * @description
   * 鉴权
   */
  isPermitted(userId: number, permitBy: PermitBy) {
    return lastValueFrom(
      this.client.send<boolean>(
        {
          cmd: CommandToken.Permit,
        },
        {
          userId,
          ...permitBy,
        },
      ),
    );
  }

  /**
   * @description
   * 当前用户是否在登录有效期
   */
  async isLoggedIn(userId: number) {
    return await lastValueFrom<boolean>(
      this.client.send(
        {
          cmd: CommandToken.isLoggedIn,
        },
        userId,
      ),
    );
  }
}
