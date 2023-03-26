// nest
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
// project
import { Pagination, Permission } from 'assets/decorators';
import { AuthorizationActionCode } from '../auth/entities/authorization-action.entity';
import { AuthorizationResourceCode } from '../auth/entities/authorization-resource.entity';
import { Menu } from '../menu/entities/menu.entity';
import { PaginatedTenants } from './dto/paginated-tenants';
import { Tenant } from './entities/tenant.entity';
import { TenantService } from './tenant.service';
import { PaginateBy } from 'assets/dto';
import { CreateTenantBy } from './dto/create-tenant-by.input';
import { UpdateTenantBy } from './dto/update-tenant-by.input';

@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Mutation(() => Tenant, { description: '创建租户' })
  @Permission({
    resource: AuthorizationResourceCode.Tenant,
    action: AuthorizationActionCode.Create,
  })
  createTenant(@Args('createTenantBy') createBy: CreateTenantBy) {
    return this.tenantService.create(createBy);
  }

  @Query(() => PaginatedTenants, {
    name: 'tenants',
    description: '分页查询租户',
  })
  getTenants(@Pagination() paginateBy: PaginateBy) {
    return this.tenantService.getTenants({ paginateBy });
  }

  @Query(() => Tenant, {
    name: 'tenant',
    description: '查询单个租户',
    nullable: true,
  })
  @Permission({
    resource: AuthorizationResourceCode.Tenant,
    action: AuthorizationActionCode.Retrieve,
  })
  getTenant(
    @Args('code', {
      type: () => String,
    })
    code: string,
  ) {
    return this.tenantService.getTenant(code);
  }

  @Mutation(() => Boolean, { description: '更新租户' })
  @Permission({
    resource: AuthorizationResourceCode.Tenant,
    action: AuthorizationActionCode.Update,
  })
  updateTenant(
    @Args('code', { type: () => String }) code: string,
    @Args('updateTenantBy') updateBy: UpdateTenantBy,
  ) {
    return this.tenantService.update(code, updateBy);
  }

  @Mutation(() => Boolean, { description: '删除租户' })
  @Permission({
    resource: AuthorizationResourceCode.Tenant,
    action: AuthorizationActionCode.Delete,
  })
  removeTenant(@Args('code', { type: () => String }) code: string) {
    return this.tenantService.remove(code);
  }

  @ResolveField(() => [Menu], {
    name: 'menus',
    description: '租户对应的菜单',
  })
  getMenus(@Parent() tenant: Tenant) {
    return this.tenantService.getTenantMenus(tenant.code);
  }
}
