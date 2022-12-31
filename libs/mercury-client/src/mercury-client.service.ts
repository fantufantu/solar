// nest
import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
// third
import { lastValueFrom } from 'rxjs';
// project
import { MercuryServiceCmd, ProviderToken } from 'assets/enums';
import type { Options } from 'assets/decorators';

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
  isPermitted(userId: number, options: Options) {
    return lastValueFrom(
      this.client.send<boolean>(
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

  /**
   * 获取jwt secrect
   */
  getJwtSecrect() {
    return lastValueFrom(
      this.client.send<string, null>(
        {
          cmd: MercuryServiceCmd.GetJwtSecret,
        },
        null,
      ),
    );
  }
}
