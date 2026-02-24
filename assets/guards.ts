import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { METADATA_TOKEN } from 'assets/tokens';
import { MercuryClientService } from '@/libs/mercury-client';
import { AuthorizationPoint } from 'apps/mercury/src/role/dto/authorization';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly mercuryClientService: MercuryClientService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorizationPoint =
      this.reflector.getAllAndOverride<AuthorizationPoint>(
        METADATA_TOKEN.AUTHORIZATION,
        [context.getHandler(), context.getClass()],
      );

    // 无需鉴权
    if (!authorizationPoint) return true;
    // 获取用户信息
    const { user } = GqlExecutionContext.create(context).getContext().req;
    // 用户信息为空 = 无权
    if (!user) return false;
    // 鉴权
    return this.mercuryClientService.isAuthorized(user.id, authorizationPoint);
  }
}
