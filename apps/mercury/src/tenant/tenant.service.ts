// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import type { Repository } from 'typeorm';
// project
import { Tenant } from './entities/tenant.entity';
import { paginateQuery } from 'utils/api';
import type { QueryParams } from 'typings/api';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  /**
   * 分页查询租户
   */
  getTenants(query?: QueryParams) {
    return paginateQuery(this.tenantRepository, query);
  }
}
