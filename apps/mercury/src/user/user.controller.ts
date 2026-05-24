import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { COMMAND_TOKENS } from 'assets/tokens';
import { GetUserBy } from 'typings/micro-service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: COMMAND_TOKENS.GET_USER })
  async user({ id, username }: GetUserBy) {
    return await this.userService.who({ where: { id, username } });
  }
}
