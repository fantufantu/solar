// nest
import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
// third
import { lastValueFrom } from 'rxjs';
// project
import { MercuryServiceCmd, CustomProviderToken } from 'assets/enums';
import type { Options } from 'assets/decorators/permission.decorator';

@Injectable()
export class MercuryClientService {
  constructor(
    @Inject(CustomProviderToken.MercuryClientProxy)
    private readonly client: ClientProxy,
  ) {}

  /**
   * 根据用户id获取用户信息
   */
  async getUserById(id: number) {
    return await lastValueFrom(
      this.client.send(
        {
          cmd: MercuryServiceCmd.GetUser,
        },
        id,
      ),
    );
  }

  /**
   * 鉴权
   */
  async isPermitted(userId: number, options: Options) {
    return await lastValueFrom(
      this.client.send(
        {
          cmd: MercuryServiceCmd.Permit,
        },
        {
          userId,
          ...options,
        },
      ),
    );
  }
}
