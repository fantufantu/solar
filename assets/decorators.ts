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
export interface PermitBy {
  resource: AuthorizationResourceCode;
  action: AuthorizationActionCode;
}

/**
 * 鉴权
 */
export const Permission = (permitBy: PermitBy) => {
  return applyDecorators(
    SetMetadata(MetadataToken.Permission, permitBy),
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
 * 分页参数
 */
export const Pagination = () => {
  return Args('paginateBy', {
    nullable: true,
    description: '分页参数',
  });
};

/**
 * 筛选参数
 */
export const Filter = (options?: Pick<ArgsOptions, 'type' | 'nullable'>) => {
  return Args('filterBy', {
    nullable: true,
    description: '筛选参数',
    ...options,
  });
};

/**
 * 排序参数
 */
export const Sort = () => {
  return Args('sort', {
    nullable: true,
    description: '排序参数',
  });
};
