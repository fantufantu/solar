// nest
import { Resolver } from '@nestjs/graphql';
// project
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
}
