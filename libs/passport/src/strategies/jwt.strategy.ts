import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  type StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import type { Request } from 'express';
import { MercuryClientService } from 'libs/mercury-client/src';
import { CacheToken, ProviderToken } from 'assets/tokens';
import type { Authentication } from '../dto/authentication';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { toCacheKey } from 'utils/cache';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ProviderToken.JwtSecret) jwtSecret: string,
    private readonly client: MercuryClientService,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (request: Request) =>
        ExtractJwt.fromAuthHeaderAsBearerToken()(request),
      secretOrKeyProvider: (_request, authenticated: string, done) => {
        cacheManager
          .get<boolean>(toCacheKey(CacheToken.Authenticated, authenticated))
          .catch(() => false)
          .then((isValid = false) => {
            if (isValid) return done(null, jwtSecret);
            return done(new UnauthorizedException('当前信息已经失效！'));
          });
      },
      ignoreExpiration: false,
      passReqToCallback: false,
    } as StrategyOptionsWithoutRequest);
  }

  async validate(payload: Authentication) {
    // token有效
    // 获取数据库中的user信息
    const user = await this.client.getUserById(payload.id);

    if (!user)
      throw new UnauthorizedException(
        '非常抱歉，服务端没有匹配到正确的用户信息！',
      );
    return user;
  }
}
