import { AuthorizationActionCode } from '@/libs/database/entities/mercury/authorization.entity';

/**
 * 检查的权限点
 */
export interface PermissionPoint {
  resource: string;
  action: AuthorizationActionCode;
}
