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
import { tap } from 'rxjs/operators';
import { toCacheKey } from 'utils/cache';

/**
 * @description
 * 在用户登录、或者注册后，缓存下用户token
 */
@Injectable()
export class AuthenticatedInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  intercept(_context: ExecutionContext, next: CallHandler<string>) {
    return next.handle().pipe(
      tap((authenticated) => {
        // 有效期7天
        this.cacheManager.set(
          toCacheKey(CacheToken.Authenticated, authenticated),
          true,
          7 * 24 * 60 * 60 * 1000,
        );
      }),
    );
  }
}
