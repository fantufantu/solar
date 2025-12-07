import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RoleService } from './role.service';
import { CommandToken } from 'assets/tokens';
import { PermissionPoint } from './dto/permission';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern({ cmd: CommandToken.Authorize })
  async isAuthorized({
    who,
    permissionPoint,
  }: {
    who: number;
    permissionPoint: PermissionPoint;
  }) {
    return await this.roleService.isAuthorized(who, permissionPoint);
  }
}
