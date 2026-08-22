import {
  AuthorizationActionCode,
  AuthorizationResourceCode,
} from '@/libs/database/entities/mercury/authorization.entity';

/**
 * 检查的权限点
 */
export interface AuthorizationPoint {
  resource: AuthorizationResourceCode;
  action: AuthorizationActionCode;
}
