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
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<[authenticated: string, userId: number]>,
  ) {
    return next.handle().pipe(
      map(([authenticated, userId]) => {
        // 有效期7天
        this.cacheManager.set(
          toCacheKey(CacheToken.Authenticated, userId),
          true,
          7 * 24 * 60 * 60 * 1000,
        );

        return authenticated;
      }),
    );
  }
}
