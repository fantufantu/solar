import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import type { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';

@Injectable()
export class MenuLoader {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly menuService: MenuService,
  ) {}

  /**
   * 根据id获取菜单
   */
  public readonly getMenuById = new DataLoader<number, Menu | undefined>(
    async (ids: number[]) => {
      const menus = (
        await this.menuService.getMenus({
          filterBy: {
            id: In(ids),
          },
        })
      )[0];

      return ids.map((id) => menus.find((menu) => menu.id === id));
    },
  );

  /**
   * 根据 id 获取子菜单
   */
  public readonly getChildrenById = new DataLoader<number, Menu[]>(
    async (ids) => {
      const menus = await this.menuRepository
        .createQueryBuilder('menu')
        .leftJoinAndMapMany(
          'menu.children',
          'menu.children',
          'child',
          'child.parentId = menu.id',
        )
        .whereInIds(ids)
        .getMany();

      return ids.map(
        (id) => menus.find((menu) => menu.id === id)?.children || [],
      );
    },
  );
}
