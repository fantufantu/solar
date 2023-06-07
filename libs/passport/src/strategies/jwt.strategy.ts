// nest
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// third
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
// project
import { MercuryClientService } from 'libs/mercury-client/src';
import { ProviderToken } from 'assets/tokens';
import type { Authentication } from '../dtos/authentication';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ProviderToken.JwtSecretService) jwtSecret: string,
    private readonly client: MercuryClientService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
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
