import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { CommandToken } from 'assets/tokens';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern({ cmd: CommandToken.isLoggedIn })
  async isLoggedIn(userId: number) {
    return await this.authenticationService.isLoggedIn(userId);
  }
}
