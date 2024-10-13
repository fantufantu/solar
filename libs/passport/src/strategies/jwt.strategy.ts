import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  type StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import type { Request } from 'express';
import { MercuryClientService } from 'libs/mercury-client/src';
import { ProviderToken } from 'assets/tokens';
import type { Authentication } from '../dto/authentication';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ProviderToken.JwtSecret) jwtSecret: string,
    private readonly client: MercuryClientService,
  ) {
    super({
      jwtFromRequest: (request: Request) =>
        ExtractJwt.fromAuthHeaderAsBearerToken()(request),
      secretOrKeyProvider: (_request, authenticated: string, done) => {
        client.isAuthenticatedValid(authenticated).then((isValid) => {
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
