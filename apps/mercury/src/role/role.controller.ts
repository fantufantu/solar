import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RoleService } from './role.service';
import { COMMAND_TOKENS } from 'constants/common.constant';
import { AuthorizationPoint } from './dto/authorization';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern({ cmd: COMMAND_TOKENS.AUTHORIZE })
  async isAuthorized({
    who,
    authorizationPoint,
  }: {
    who: string;
    authorizationPoint: AuthorizationPoint;
  }) {
    return await this.roleService.isAuthorized(who, authorizationPoint);
  }
}
