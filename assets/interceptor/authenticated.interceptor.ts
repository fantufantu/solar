import { CacheService } from '@/libs/cache';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { CacheToken } from 'assets/tokens';
import type { Cache } from 'cache-manager';
import { map } from 'rxjs/operators';
import { toCacheKey } from 'utils/cache';

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
