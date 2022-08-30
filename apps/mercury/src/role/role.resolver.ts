// nest
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
// project
import { Permission } from 'assets/decorators/permission.decorator';
import { PaginateInput } from 'assets/dtos';
import { AuthorizationActionCode } from '../auth/entities/authorization-action.entity';
import { AuthorizationResourceCode } from '../auth/entities/authorization-resource.entity';
import { PaginatedRole } from './dtos/paginated-roles';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import type { CreateRoleInput } from './dtos/create-role.input';
import type { UpdateRoleInput } from './dtos/update-role.input';

@Resolver()
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Mutation(() => Role, {
    description: '创建角色',
  })
  @Permission({
    resource: AuthorizationResourceCode.Role,
    action: AuthorizationActionCode.Create,
  })
  createRole(@Args('createRoleInput') role: CreateRoleInput) {
    return this.roleService.create(role);
  }

  @Query(() => PaginatedRole, {
    name: 'roles',
    description: '分页查询角色',
  })
  @Permission({
    resource: AuthorizationResourceCode.Role,
    action: AuthorizationActionCode.Retrieve,
  })
  getRoles(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
  ) {
    return this.roleService.getRoles({
      paginateInput,
    });
  }

  @Query(() => Role, { name: 'role', description: '查询单个角色' })
  @Permission({
    resource: AuthorizationResourceCode.Role,
    action: AuthorizationActionCode.Retrieve,
  })
  getRole(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.getRole(id);
  }

  @Mutation(() => Boolean, {
    description: '更新角色',
  })
  @Permission({
    resource: AuthorizationResourceCode.Role,
    action: AuthorizationActionCode.Update,
  })
  updateRole(
    @Args('id', {
      type: () => Int,
    })
    id: number,
    @Args('updateRoleInput') role: UpdateRoleInput,
  ) {
    return this.roleService.update(id, role);
  }

  @Mutation(() => Boolean, {
    description: '删除角色',
  })
  @Permission({
    resource: AuthorizationResourceCode.Role,
    action: AuthorizationActionCode.Delete,
  })
  removeRole(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.remove(id);
  }

  @ResolveField(() => [Int], {
    name: 'userIds',
    description: '关联的用户ids',
  })
  getUserIds(@Parent() role: Role) {
    return this.roleService.getUserIds(role.id);
  }

  @ResolveField(() => [Int], {
    name: 'authorizationIds',
    description: '关联的权限ids',
  })
  getAuthorizationIds(@Parent() role: Role) {
    return this.roleService.getAuthorizationIds(role.id);
  }
}
