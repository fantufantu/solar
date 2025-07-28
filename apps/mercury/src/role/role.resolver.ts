import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PaginateBy } from 'assets/dto/paginate-by.input';
import { AuthorizationActionCode } from '@/libs/database/entities/mercury/authorization-action.entity';
import { AuthorizationResourceCode } from '@/libs/database/entities/mercury/authorization-resource.entity';
import { PaginatedRole } from './dto/paginated-roles.object';
import { Role } from '@/libs/database/entities/mercury/role.entity';
import { RoleService } from './role.service';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Permission } from 'utils/decorators/permission.decorator';
import { Pagination } from 'utils/decorators/filter.decorator';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Mutation(() => Role, {
    description: '创建角色',
  })
  @Permission({
    resource: AuthorizationResourceCode.Role,
    action: AuthorizationActionCode.Create,
  })
  createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
    return this.roleService.create(createRoleInput);
  }

  @Query(() => PaginatedRole, {
    name: 'roles',
    description: '分页查询角色',
  })
  @Permission({
    resource: AuthorizationResourceCode.Role,
    action: AuthorizationActionCode.Read,
  })
  getRoles(@Pagination() paginateBy: PaginateBy) {
    return this.roleService.getRoles({
      paginateBy,
    });
  }

  @Query(() => Role, { name: 'role', description: '查询单个角色' })
  @Permission({
    resource: AuthorizationResourceCode.Role,
    action: AuthorizationActionCode.Read,
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
    @Args('updateRoleInput') updateRoleInput: UpdateRoleInput,
  ) {
    return this.roleService.update(id, updateRoleInput);
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
