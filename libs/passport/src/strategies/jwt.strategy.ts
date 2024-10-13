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
      secretOrKey: jwtSecret,
      ignoreExpiration: false,
      passReqToCallback: false,
    } as StrategyOptionsWithoutRequest);
  }

  async validate(payload: Authentication) {
    // 校验当前用户是否已经强制登出
    const isLoggedIn = await this.client.isLoggedIn(payload.id);
    if (!isLoggedIn) {
      throw new UnauthorizedException(
        '非常抱歉，您的用户凭证已过期，请重新登录！',
      );
    }

    // 获取数据库中的user信息
    const user = await this.client.getUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException(
        '非常抱歉，服务端没有匹配到正确的用户信息！',
      );
    }

    return user;
  }
}
