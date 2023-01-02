// nest
import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
// third
import { lastValueFrom } from 'rxjs';
// project
import { CommandToken, ProviderToken } from 'assets/tokens';
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
          cmd: CommandToken.GetUser,
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
          cmd: CommandToken.Permit,
        },
        {
          userId,
          ...options,
        },
      ),
    );
  }

  /**
   * 获取配置项
   */
  getConfig(propertyPath: string) {
    return lastValueFrom(
      this.client.send<string, string>(
        {
          cmd: CommandToken.GetConfig,
        },
        propertyPath,
      ),
    );
  }
}
