// nest
import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
  UseGuards,
} from '@nestjs/common';
import { Args, ArgsOptions, GqlExecutionContext } from '@nestjs/graphql';
// project
import { JwtAuthGuard } from '@app/passport/guards';
import { AuthorizationActionCode } from 'apps/mercury/src/auth/entities/authorization-action.entity';
import { AuthorizationResourceCode } from 'apps/mercury/src/auth/entities/authorization-resource.entity';
import { MetadataToken } from 'assets/tokens';
import { PermissionGuard } from 'assets/guards';

/**
 * 权限路径
 */
export interface PermissionOptions {
  resource: AuthorizationResourceCode;
  action: AuthorizationActionCode;
}

/**
 * 鉴权
 */
export const Permission = (options: PermissionOptions) => {
  return applyDecorators(
    SetMetadata(MetadataToken.Permission, options),
    UseGuards(JwtAuthGuard, PermissionGuard),
  );
};

/**
 * 用户信息
 */
export const WhoAmI = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);

/**
 * 分页入参
 */
export const Pagination = () => {
  return Args('pagination', {
    nullable: true,
  });
};

/**
 * 筛选入参
 */
export const Filter = (options?: Pick<ArgsOptions, 'type'>) => {
  return Args('filter', {
    nullable: true,
    description: '筛选条件',
    ...options,
  });
};

/**
 * 排序入参
 */
export const Sort = () => {
  return Args('sort', {
    nullable: true,
  });
};
