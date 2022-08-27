// nest
import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
// third
import { lastValueFrom } from 'rxjs';
// project
import { MercuryServiceCMD, CustomProviderToken } from 'assets/enums';

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
          cmd: MercuryServiceCMD.GetUser,
        },
        id,
      ),
    );
  }
}
