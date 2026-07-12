import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { COMMAND_TOKENS } from 'constants/common.constant';
import type { GetUserBy } from 'typings/micro-service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: COMMAND_TOKENS.GET_USER })
  async user({ id }: GetUserBy) {
    return await this.userService.who({ where: { id } });
  }

  @MessagePattern({ cmd: COMMAND_TOKENS.GET_USERS })
  async users(ids: string[]) {
    return await this.userService.getUsersByIds(ids);
  }
}
