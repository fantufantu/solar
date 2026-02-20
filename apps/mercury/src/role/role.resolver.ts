import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Pagination } from 'assets/dto/pagination.input';
import { PaginatedRole } from './dto/paginated-roles.object';
import { Role } from '@/libs/database/entities/mercury/role.entity';
import { RoleService } from './role.service';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Permission } from 'utils/decorators/permission.decorator';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { AuthorizationActionCode } from '@/libs/database/entities/mercury/authorization.entity';
import { UseInterceptors } from '@nestjs/common';
import { PaginatedInterceptor } from 'assets/interceptors/paginated.interceptor';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Mutation(() => Role, {
    description: '创建角色',
  })
  // @Permission({
  //   resource: Role.name,
  //   action: AuthorizationActionCode.Create,
  // })
  createRole(@Args('input') input: CreateRoleInput) {
    return this.roleService.create(input);
  }

  @Query(() => PaginatedRole, {
    description: '分页查询角色',
  })
  @UseInterceptors(PaginatedInterceptor)
  // @Permission({
  //   resource: Role.name,
  //   action: AuthorizationActionCode.Read,
  // })
  paginateRoles(@PaginationArgs() pagination: Pagination) {
    return this.roleService.paginate({
      pagination,
    });
  }

  @Query(() => Role, { description: '查询单个角色' })
  // @Permission({
  //   resource: Role.name,
  //   action: AuthorizationActionCode.Read,
  // })
  role(@Args('code', { type: () => String }) code: string) {
    return this.roleService.role(code);
  }

  @Mutation(() => Boolean, {
    description: '更新角色',
  })
  @Permission({
    resource: Role.name,
    action: AuthorizationActionCode.Update,
  })
  updateRole(
    @Args('code', {
      type: () => String,
    })
    code: string,
    @Args('input') input: UpdateRoleInput,
  ) {
    return this.roleService.update(code, input);
  }

  @Mutation(() => Boolean, {
    description: '删除角色',
  })
  @Permission({
    resource: Role.name,
    action: AuthorizationActionCode.Delete,
  })
  removeRole(@Args('code', { type: () => String }) code: string) {
    return this.roleService.remove(code);
  }
}
