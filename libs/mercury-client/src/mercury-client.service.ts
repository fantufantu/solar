// nest
import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
// third
import { lastValueFrom } from 'rxjs';
// project
import { CommandToken, ProviderToken } from 'assets/tokens';
import { User } from 'apps/mercury/src/user/entities/user.entity';
import type { PermitBy } from 'assets/decorators';

@Injectable()
export class MercuryClientService {
  constructor(
    @Inject(ProviderToken.MercuryClientProxy)
    private readonly client: ClientProxy,
  ) {}

  /**
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
}
