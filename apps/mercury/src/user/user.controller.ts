import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CommandToken } from 'assets/tokens';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: CommandToken.GetUser })
  async user(id: number) {
    return await this.userService.user(id);
  }
}
