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
import { AuthorizationResourceCode } from '../auth/entities/authorization-resource.entity';
import { AuthorizationActionCode } from '../auth/entities/authorization-action.entity';
import { PaginatedMenus } from './dto/paginated-menus';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/passport/guards';
import { WhoAmI, Pagination, Permission, Filter } from 'assets/decorators';
import { User } from '../user/entities/user.entity';
import { MenuService } from './menu.service';
import { MenuLoader } from './menu.loader';
import { CreateMenuInput } from './dto/create-menu.input';
import { UpdateMenuInput } from './dto/update-menu.input';
import { PaginationInput } from 'assets/dto';
import { FilterMenuInput } from './dto/filter-menu.args';

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
    @Pagination() pagination: PaginationInput,
    @Filter() filter: FilterMenuInput,
    @WhoAmI() user: User | null,
  ) {
    return this.menuService.getMenus(
      {
        pagination,
        filter,
        sort: {
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
