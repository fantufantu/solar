import { CacheService } from '@/libs/cache';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

/**
 * @description
 * 在用户登录、或者注册后，缓存下用户token
 */
@Injectable()
export class AuthenticatedInterceptor implements NestInterceptor {
  constructor(private readonly cacheService: CacheService) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<[authenticated: string, userId: number]>,
  ) {
    return next.handle().pipe(
      map(([authenticated, userId]) => {
        // 设置缓存
        this.cacheService.setAuthenticated(userId);
        return authenticated;
      }),
    );
  }
}
