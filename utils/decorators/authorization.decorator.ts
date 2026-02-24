import { JwtAuthGuard } from '@/libs/passport/guards';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthorizationPoint } from 'apps/mercury/src/role/dto/authorization';
import { AuthorizationGuard } from 'assets/guards';
import { METADATA_TOKEN } from 'assets/tokens';

/**
 * 鉴权
 */
export const Authorization = (authorizationPoint: AuthorizationPoint) => {
  return applyDecorators(
    SetMetadata(METADATA_TOKEN.AUTHORIZATION, authorizationPoint),
    UseGuards(JwtAuthGuard, AuthorizationGuard),
  );
};
