// nest
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// third
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
// project
import { MercuryClientService } from 'libs/mercury-client/src';
import { CustomProviderToken } from 'assets/enums';
import type { Authentication } from '../dtos/authentication';
import type { User } from 'apps/mercury/src/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CustomProviderToken.JwtSecretService) jwtSecret: string,
    private readonly mercuryClientService: MercuryClientService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        // 先从cookie里面获取token
        const token =
          req.cookies &&
          (req.cookies['__Secure-next-auth.session-token'] ||
            req.cookies['next-auth.session-token']);

        if (token) return token;

        // cookie中不存在，获取请求头
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: Authentication): Promise<User> {
    // token有效
    // 获取数据库中的user信息
    const user = await this.mercuryClientService.getUserById(payload.id);

    if (!user)
      throw new UnauthorizedException(
        '非常抱歉，服务端没有匹配到正确的用户信息！',
      );

    return user;
  }
}
