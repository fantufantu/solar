import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Pagination } from 'assets/dto/pagination.input';
import { PaginatedRole } from './dto/paginated-roles.object';
import { Role } from '@/libs/database/entities/mercury/role.entity';
import { RoleService } from './role.service';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Permission } from 'utils/decorators/permission.decorator';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { AuthorizationActionCode } from '@/libs/database/entities/mercury/authorization.entity';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Mutation(() => Role, {
    description: '创建角色',
  })
  @Permission({
    resource: Role.name,
    action: AuthorizationActionCode.Create,
  })
  createRole(@Args('input') input: CreateRoleInput) {
    return this.roleService.create(input);
  }

  @Query(() => PaginatedRole, {
    description: '分页查询角色',
  })
  @Permission({
    resource: Role.name,
    action: AuthorizationActionCode.Read,
  })
  roles(@PaginationArgs() pagination: Pagination) {
    return this.roleService.getRoles({
      pagination,
    });
  }

  @Query(() => Role, { description: '查询单个角色' })
  @Permission({
    resource: Role.name,
    action: AuthorizationActionCode.Read,
  })
  role(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.getRole(id);
  }

  @Mutation(() => Boolean, {
    description: '更新角色',
  })
  @Permission({
    resource: Role.name,
    action: AuthorizationActionCode.Update,
  })
  updateRole(
    @Args('id', {
      type: () => Int,
    })
    id: number,
    @Args('input') input: UpdateRoleInput,
  ) {
    return this.roleService.update(id, input);
  }

  @Mutation(() => Boolean, {
    description: '删除角色',
  })
  @Permission({
    resource: Role.name,
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
