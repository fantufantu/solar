// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import type { Repository } from 'typeorm';
// project
import { Tenant } from './entities/tenant.entity';
import { paginateQuery } from 'utils/api';
import { MenuService } from '../menu/menu.service';
import type { CreateTenantInput } from './dto/create-tenant.input';
import type { UpdateTenantInput } from './dto/update-tenant.input';
import type { QueryBy } from 'typings/api';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly menuService: MenuService,
  ) {}

  /**
   * 创建租户
   */
  create(createTenantInput: CreateTenantInput) {
    return this.tenantRepository.save(
      this.tenantRepository.create(createTenantInput),
    );
  }

  /**
   * 分页查询租户
   */
  getTenants(queryBy?: QueryBy<Tenant>) {
    return paginateQuery(this.tenantRepository, queryBy);
  }

  /**
   * 查询单个租户
   */
  getTenant(code: string) {
    return this.tenantRepository.findOne({
      where: [
        {
          code,
        },
      ],
    });
  }

  /**
   * 更新租户
   */
  async update(code: string, updateTenantInput: UpdateTenantInput) {
    return !!(
      await this.tenantRepository
        .createQueryBuilder()
        .update()
        .whereInIds(code)
        .set({
          ...updateTenantInput,
        })
        .execute()
    ).affected;
  }

  /**
   * 删除租户
   */
  async remove(code: string) {
    return !!(
      await this.tenantRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(code)
        .execute()
    ).affected;
  }

  /**
   * 查询租户对应的菜单
   */
  async getTenantMenus(tenantCode: string) {
    return (
      await this.menuService.getMenus({
        filterBy: {
          tenantCode,
        },
        sortBy: {
          sortBy: 'ASC',
        },
      })
    )[0];
  }
}
