import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CommandToken, ProviderToken } from 'assets/tokens';
import type { GetConfigurationBy } from 'typings/micro-service';
import type { PartialTuple } from '@aiszlab/relax/types';

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
  async getConfiguration<T>(getBy: GetConfigurationBy) {
    return await lastValueFrom(
      this.client.send<T, GetConfigurationBy>(
        {
          cmd: CommandToken.GetConfiguration,
        },
        getBy,
      ),
    );
  }

  /**
   * @description
   * 调用pluto获取配置项的列表
   * 传入不同配置项对应的token列表
   *
   * 以列表形式获取数据，减少TCP链接
   */
  async getConfigurations<T extends unknown[]>(tokens: GetConfigurationBy[]) {
    return await lastValueFrom(
      this.client.send<PartialTuple<T>, GetConfigurationBy[]>(
        {
          cmd: CommandToken.GetConfigurations,
        },
        tokens,
      ),
    );
  }
}
