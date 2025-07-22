import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RoleService } from './role.service';
import { CommandToken } from 'assets/tokens';
import { Authorizing } from 'utils/decorators/permission.decorator';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern({ cmd: CommandToken.Authorize })
  async isAuthorized({
    userId,
    authorizing,
  }: {
    userId: number;
    authorizing: Authorizing;
  }) {
    return await this.roleService.isAuthorized(userId, authorizing);
  }
}
