import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CommandToken, ProviderToken } from 'assets/tokens';
import type { GetConfigurationBy } from 'typings/micro-service';

@Injectable()
export class PlutoClientService {
  constructor(
    @Inject(ProviderToken.PlutoClientProxy)
    private readonly client: ClientProxy,
  ) {}

  /**
   * @description
   * 调用pluto微服务获取配置项
   */
  async getConfig<T>(getBy: GetConfigurationBy) {
    return await lastValueFrom(
      this.client.send<T, GetConfigurationBy>(
        {
          cmd: CommandToken.GetConfiguration,
        },
        getBy,
      ),
    );
  }
}
