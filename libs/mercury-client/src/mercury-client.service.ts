import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { COMMAND_TOKENS, ProviderToken } from 'assets/tokens';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { AuthorizationPoint } from 'apps/mercury/src/role/dto/authorization';
import type { GetUserBy } from 'typings/micro-service';

@Injectable()
export class MercuryClientService {
  constructor(
    @Inject(ProviderToken.MercuryClientProxy)
    private readonly client: ClientProxy,
  ) {}

  /**
   * 获取用户信息，支持通过`id`或`username`查询
   */
  async getUser(params: GetUserBy) {
    return await lastValueFrom<User | null>(
      this.client.send(
        {
          cmd: COMMAND_TOKENS.GET_USER,
        },
        params,
      ),
    );
  }

  /**
   * 鉴权
   */
  isAuthorized(who: number, authorizationPoint: AuthorizationPoint) {
    return lastValueFrom(
      this.client.send<boolean>(
        {
          cmd: COMMAND_TOKENS.AUTHORIZE,
        },
        {
          who,
          authorizationPoint,
        },
      ),
    );
  }

  /**
   * 当前用户是否在登录有效期
   */
  async isLoggedIn(userId: number) {
    return await lastValueFrom<boolean>(
      this.client.send(
        {
          cmd: COMMAND_TOKENS.IS_LOGGED_IN,
        },
        userId,
      ),
    );
  }
}
