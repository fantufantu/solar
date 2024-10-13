import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { CommandToken } from 'assets/tokens';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern({ cmd: CommandToken.IsAuthenticatedValid })
  async isAuthenticatedValid(authenticated: string) {
    return await this.authenticationService.isAuthenticatedValid(authenticated);
  }
}
