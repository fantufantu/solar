import type { User } from '@/lib/database/entities/mercury/user.entity';

/**
 * @description
 * 运行上下文信息
 */
export interface RuntimeContext {
  req?: {
    user?: User;
  };
}
