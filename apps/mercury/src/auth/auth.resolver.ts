// nest
import { Resolver } from '@nestjs/graphql';
// project
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String, { description: '登录' })
  login(@Args('loginInput') login: LoginInput) {
    return this.authService.login(login);
  }
}
