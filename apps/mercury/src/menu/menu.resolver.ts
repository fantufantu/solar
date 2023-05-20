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
import { CreateMenuBy } from './dto/create-menu-by.input';
import { UpdateMenuBy } from './dto/update-menu-by.input';
import { PaginateBy } from 'assets/dto';
import { FilterMenuBy } from './dto/filter-menu-by.args';

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
  createMenu(@Args('createBy') createBy: CreateMenuBy) {
    return this.menuService.create(createBy);
  }

  @Query(() => PaginatedMenus, {
    name: 'menus',
    description: '分页查询菜单',
  })
  @UseGuards(new JwtAuthGuard(true))
  getMenus(
    @Pagination() paginateBy: PaginateBy,
    @Filter() filterBy: FilterMenuBy,
    @WhoAmI() user: User,
  ) {
    return this.menuService.getMenus(
      {
        paginateBy,
        filterBy,
        sortBy: {
          sortBy: 'ASC',
        },
      },
      user.id,
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
    @Args('updateBy') updateBy: UpdateMenuBy,
  ) {
    return this.menuService.update(id, updateBy);
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
    if (!menu.parentId) return null;
    return this.menuLoader.getMenuById.load(menu.parentId);
  }

  @ResolveField(() => [Menu], {
    description: '下级菜单',
    name: 'children',
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
