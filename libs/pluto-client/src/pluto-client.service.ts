// nest
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// third
import { lastValueFrom } from 'rxjs';
// project
import { CommandToken, ProviderToken } from 'assets/tokens';
import type { GetConfigInput } from 'typings/micro-service';

@Injectable()
export class PlutoClientService {
  constructor(
    @Inject(ProviderToken.PlutoClientProxy)
    private readonly client: ClientProxy,
  ) {}

  /**
   * 获取配置项
   */
  async getConfig<T>(input: GetConfigInput) {
    return await lastValueFrom(
      this.client.send<T, GetConfigInput>(
        {
          cmd: CommandToken.GetConfig,
        },
        input,
      ),
    );
  }
}
