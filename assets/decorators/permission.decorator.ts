// nest
import { JwtAuthGuard } from '@app/passport/guards';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
// project
import { AuthorizationActionCode } from 'apps/mercury/src/auth/entities/authorization-action.entity';
import { AuthorizationResourceCode } from 'apps/mercury/src/auth/entities/authorization-resource.entity';
import { CustomMetadataKey } from 'assets/enums';
import { PermissionGuard } from 'assets/guards';

export interface Options {
  resource: AuthorizationResourceCode;
  action: AuthorizationActionCode;
}

export const Permission = (options: Options) => {
  return applyDecorators(
    SetMetadata(CustomMetadataKey, options),
    UseGuards(JwtAuthGuard, PermissionGuard),
  );
};
