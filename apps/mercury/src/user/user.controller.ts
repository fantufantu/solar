import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CommandToken } from 'assets/tokens';
import { GetUserBy } from 'typings/micro-service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: CommandToken.GetUser })
  async user({ id, username }: GetUserBy) {
    return await this.userService.who({ where: { id, username } });
  }
}
