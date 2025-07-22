import { AuthorizationActionCode } from '@/libs/database/entities/mercury/authorization-action.entity';
import { AuthorizationResourceCode } from '@/libs/database/entities/mercury/authorization-resource.entity';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionGuard } from 'assets/guards';
import { MetadataToken } from 'assets/tokens';

/**
 * 权限路径
 */
export interface Authorizing {
  resource: AuthorizationResourceCode;
  action: AuthorizationActionCode;
}

/**
 * 鉴权
 */
export const Permission = (authorizing: Authorizing) => {
  return applyDecorators(
    SetMetadata(MetadataToken.Permission, authorizing),
    UseGuards(JwtAuthGuard, PermissionGuard),
  );
};
