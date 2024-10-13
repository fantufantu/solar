import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthenticationService } from './authentication.service';
import { LoginBy } from './dto/login-by.input';
import { RegisterBy } from './dto/register-by.input';
import { UseInterceptors } from '@nestjs/common';
import { AuthenticatedInterceptor } from 'assets/interceptor/authenticated.interceptor';

@Resolver()
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Mutation(() => String, { description: '登录' })
  @UseInterceptors(AuthenticatedInterceptor)
  login(@Args('loginBy') loginBy: LoginBy) {
    return this.authenticationService.login(loginBy);
  }

  @Mutation(() => String, { description: '注册' })
  @UseInterceptors(AuthenticatedInterceptor)
  register(@Args('registerBy') registerBy: RegisterBy) {
    return this.authenticationService.register(registerBy);
  }
}
