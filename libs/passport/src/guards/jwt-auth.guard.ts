// nest
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 是否宽松模式
  // 宽松模式下。认证不通过用户为null
  // 严格模式下。认证不通过返回401
  isLoose = false;

  constructor(isLoose?: boolean) {
    super();
    this.isLoose = !!isLoose;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (!this.isLoose && (err || !user)) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
