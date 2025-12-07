import { JwtAuthGuard } from '@/libs/passport/guards';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionPoint } from 'apps/mercury/src/role/dto/permission';
import { PermissionGuard } from 'assets/guards';
import { MetadataToken } from 'assets/tokens';

/**
 * 鉴权
 */
export const Permission = (permissionPoint: PermissionPoint) => {
  return applyDecorators(
    SetMetadata(MetadataToken.Permission, permissionPoint),
    UseGuards(JwtAuthGuard, PermissionGuard),
  );
};
