import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthenticationService } from './authentication.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthenticatedInterceptor } from 'assets/interceptors/authenticated.interceptor';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { ChangePasswordInput } from './dto/change-password.input';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';

@Resolver()
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Mutation(() => String, { description: '登录' })
  @UseInterceptors(AuthenticatedInterceptor)
  login(@Args('input') input: LoginInput) {
    return this.authenticationService.login(input);
  }

  @Mutation(() => String, { description: '注册' })
  @UseInterceptors(AuthenticatedInterceptor)
  register(@Args('input') input: RegisterInput) {
    return this.authenticationService.register(input);
  }

  @Mutation(() => Boolean, { description: '修改密码' })
  changePassword(@Args('input') input: ChangePasswordInput) {
    return this.authenticationService.changePassword(input);
  }

  @Mutation(() => Boolean, { description: '注销' })
  @UseGuards(JwtAuthGuard)
  logout(@WhoAmI() who: User) {
    return this.authenticationService.logout(who.id);
  }
}
