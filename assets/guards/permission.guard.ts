// nest
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
// project
import { CustomMetadataKey } from 'assets/enums';
import { MercuryClientService } from '@app/mercury-client';
import type { Options } from 'assets/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly mercuryClientService: MercuryClientService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.getAllAndOverride<Options>(
      CustomMetadataKey.Permission,
      [context.getHandler(), context.getClass()],
    );

    //  无需鉴权
    if (!options) return true;
    // 获取用户信息
    const { user } = GqlExecutionContext.create(context).getContext().req;
    // 用户信息为空 = 无权
    if (!user) return false;
    // 鉴权
    return this.mercuryClientService.isPermitted(user.id, options);
  }
}
