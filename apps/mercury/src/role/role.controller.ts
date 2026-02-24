import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RoleService } from './role.service';
import { CommandToken } from 'assets/tokens';
import { AuthorizationPoint } from './dto/authorization';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern({ cmd: CommandToken.Authorize })
  async isAuthorized({
    who,
    authorizationPoint,
  }: {
    who: number;
    authorizationPoint: AuthorizationPoint;
  }) {
    return await this.roleService.isAuthorized(who, authorizationPoint);
  }
}
