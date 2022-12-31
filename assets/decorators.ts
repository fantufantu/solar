// nest
import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
  UseGuards,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
// project
import { JwtAuthGuard } from '@app/passport/guards';
import { AuthorizationActionCode } from 'apps/mercury/src/auth/entities/authorization-action.entity';
import { AuthorizationResourceCode } from 'apps/mercury/src/auth/entities/authorization-resource.entity';
import { CustomMetadataKey } from 'assets/enums';
import { PermissionGuard } from 'assets/guards';

/**
 * 读取用户信息 装饰器
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);

export interface Options {
  resource: AuthorizationResourceCode;
  action: AuthorizationActionCode;
}

/**
 * 鉴权 装饰器
 */
export const Permission = (options: Options) => {
  return applyDecorators(
    SetMetadata(CustomMetadataKey, options),
    UseGuards(JwtAuthGuard, PermissionGuard),
  );
};
