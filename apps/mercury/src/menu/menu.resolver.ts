// nest
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
// project
import { Menu } from './entities/menu.entity';
import { Permission } from 'assets/decorators/permission.decorator';
import { AuthorizationResourceCode } from '../auth/entities/authorization-resource.entity';
import { AuthorizationActionCode } from '../auth/entities/authorization-action.entity';
import { PaginatedMenus } from './dtos/paginated-menus';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/passport/guards';
import { CurrentUser } from 'assets/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { MenuService } from './menu.service';
import { MenuLoader } from './menu.loader';
import type { CreateMenuInput } from './dtos/create-menu.input';
import type { UpdateMenuInput } from './dtos/update-menu.input';
import type { PaginateInput } from 'assets/dtos';
import type { FilterMenuInput } from './dtos/filter-menu.input';

@Resolver(() => Menu)
export class MenuResolver {
  constructor(
    private readonly menuService: MenuService,
    private readonly menuLoader: MenuLoader,
  ) {}

  @Mutation(() => Boolean, { description: '创建菜单' })
  @Permission({
    resource: AuthorizationResourceCode.Menu,
    action: AuthorizationActionCode.Create,
  })
  createMenu(@Args('createMenuInput') menu: CreateMenuInput): Promise<boolean> {
    return this.menuService.create(menu);
  }

  @Query(() => PaginatedMenus, {
    name: 'menus',
    description: '分页查询菜单',
  })
  @UseGuards(new JwtAuthGuard(true))
  getMenus(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
    @Args('filterInput', { nullable: true }) filterInput: FilterMenuInput,
    @CurrentUser() user: User,
  ) {
    return this.menuService.getMenus(
      {
        paginateInput,
        filterInput,
        sortInput: {
          sortBy: 'ASC',
        },
      },
      user?.id,
    );
  }

  @Query(() => Menu, { name: 'menu', description: '查询单个菜单' })
  @Permission({
    resource: AuthorizationResourceCode.Menu,
    action: AuthorizationActionCode.Retrieve,
  })
  getMenu(@Args('id', { type: () => Int }) id: number) {
    return this.menuService.getMenu(id);
  }

  @Mutation(() => Boolean, { description: '更新菜单' })
  @Permission({
    resource: AuthorizationResourceCode.Menu,
    action: AuthorizationActionCode.Update,
  })
  updateMenu(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateMenuInput') menu: UpdateMenuInput,
  ) {
    return this.menuService.update(id, menu);
  }

  @Mutation(() => Boolean, { description: '删除菜单' })
  @Permission({
    resource: AuthorizationResourceCode.Menu,
    action: AuthorizationActionCode.Delete,
  })
  removeMenu(@Args('id', { type: () => Int }) id: number) {
    return this.menuService.remove(id);
  }

  @ResolveField(() => Menu, {
    description: '上级菜单',
    name: 'parent',
    nullable: true,
  })
  getParent(@Parent() menu: Menu) {
    return this.menuLoader.getMenuById.load(menu.parentId);
  }

  @ResolveField(() => [Menu], {
    description: '下级菜单',
    name: 'children',
    nullable: true,
  })
  async getChildren(@Parent() menu: Menu) {
    return this.menuLoader.getChildrenById.load(menu.id);
  }

  @ResolveField(() => [AuthorizationResourceCode], {
    description: '关联的权限资源codes',
    name: 'resourceCodes',
  })
  getResourceCodes(@Parent() parent: Menu) {
    return this.menuService.getResourceCodes(parent.id);
  }
}
