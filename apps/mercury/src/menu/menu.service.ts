// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { In, Not, Repository } from 'typeorm';
// project
import { Menu } from './entities/menu.entity';
import { paginateQuery } from 'utils/api';
import { RoleService } from '../role/role.service';
import type { QueryParameters } from 'typings/api';
import type { CreateMenuInput } from './dto/create-menu.input';
import type { FilterMenuInput } from './dto/filter-menu.args';
import type { UpdateMenuInput } from './dto/update-menu.input';
import type { AuthorizationResource } from '../auth/entities/authorization-resource.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly roleService: RoleService,
  ) {}

  /**
   * 创建菜单
   */
  async create(menu: CreateMenuInput) {
    const { resourceCodes, ...createMenuInput } = menu;

    const createdMenu = await this.menuRepository.save(
      this.menuRepository.create(createMenuInput),
    );

    resourceCodes &&
      (await this.menuRepository
        .createQueryBuilder()
        .relation('resources')
        .of(createdMenu.id)
        .add(resourceCodes));

    return !!createdMenu;
  }

  /**
   * 分页查询菜单
   */
  async getMenus(
    queryParams?: QueryParameters<FilterMenuInput>,
    userId?: number,
  ) {
    const { filter, ...otherQueryParams } = queryParams || {};
    const filters = [filter];

    // 角色权限
    if (userId) {
      const resourceCodes = await this.roleService.getResourceCodesByUserId(
        userId,
        queryParams?.filter?.tenantCode,
      );

      // 排除权限外的menu id
      const menuIds = (
        (await this.menuRepository
          .createQueryBuilder('menu')
          .leftJoinAndSelect('menu.resources', 'resource')
          .select('menu.id', 'id')
          .where(filter || {})
          .andWhere(
            resourceCodes.length
              ? 'resource.code NOT IN (:...resourceCodes)'
              : 'resource.code IS NOT NULL',
            {
              resourceCodes,
            },
          )
          .execute()) as { id: number }[]
      ).map((item) => item.id);

      menuIds.length &&
        filters.push({
          id: Not(In([menuIds])),
        });
    }

    return paginateQuery<Menu, FilterMenuInput[]>(this.menuRepository, {
      ...otherQueryParams,
      filter: filters,
    });
  }

  /**
   * 查询单个菜单
   */
  getMenu(id: number) {
    return this.menuRepository.findOneBy({ id });
  }

  /**
   * 更新菜单
   */
  async update(id: number, menu: UpdateMenuInput) {
    const { resourceCodes, ...updateMenuInput } = menu;

    // 更新菜单
    !!Object.keys(updateMenuInput).length &&
      (await this.menuRepository
        .createQueryBuilder()
        .update()
        .whereInIds(id)
        .set(updateMenuInput)
        .execute());

    // 更新关联的权限资源codes
    if (resourceCodes) {
      const resourceQueryBuild = this.menuRepository
        .createQueryBuilder()
        .relation('resources')
        .of(id);

      resourceQueryBuild.addAndRemove(
        resourceCodes,
        (await resourceQueryBuild.loadMany<AuthorizationResource>()).map(
          (resource) => resource.code,
        ),
      );
    }

    return true;
  }

  /**
   * 删除菜单
   */
  async remove(id: number) {
    return !!(
      await this.menuRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id })
        .execute()
    ).affected;
  }

  /**
   * 关联的权限资源codes
   */
  async getResourceCodes(id: number) {
    return (
      await this.menuRepository
        .createQueryBuilder()
        .relation('resources')
        .of(id)
        .loadMany<AuthorizationResource>()
    ).map((resource) => resource.code);
  }
}
