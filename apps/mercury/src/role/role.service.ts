import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Role } from '@/lib/database/entities/mercury/role.entity';
import { paginateQuery } from 'utils/api';
import { AuthorizationActionCode } from '@/lib/database/entities/mercury/authorization-action.entity';
import type { AuthorizationResourceCode } from '@/lib/database/entities/mercury/authorization-resource.entity';
import type { Authorization } from '@/lib/database/entities/mercury/authorization.entity';
import type { User } from '@/lib/database/entities/mercury/user.entity';
import type { CreateRoleBy } from './dto/create-role-by.input';
import type { UpdateRoleBy } from './dto/update-role-by.input';
import type { PermitBy } from 'assets/decorators';
import type { QueryBy } from 'typings/api';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 创建角色
   */
  create(createBy: CreateRoleBy) {
    return this.roleRepository.save(this.roleRepository.create(createBy));
  }

  /**
   * 分页查询角色
   */
  getRoles(queryBy?: QueryBy<Role>) {
    return paginateQuery(this.roleRepository, queryBy);
  }

  /**
   * 查询单个角色
   */
  getRole(id: number) {
    return this.roleRepository.findOneBy({ id });
  }

  /**
   * 更新角色
   */
  async update(id: number, updateBy: UpdateRoleBy) {
    const { userIds, authorizationIds, ...updateByWithout } = updateBy;

    // 更新关联的用户
    userIds?.length &&
      (await this.roleRepository
        .createQueryBuilder()
        .relation('users')
        .of(id)
        .add(userIds));

    // 更新关联的权限
    if (authorizationIds) {
      const removeAuthorizationIds = (
        await this.roleRepository
          .createQueryBuilder()
          .relation('authorizations')
          .of(id)
          .loadMany<Authorization>()
      ).map((auth) => auth.id);

      await this.roleRepository
        .createQueryBuilder()
        .relation('authorizations')
        .of(id)
        .addAndRemove(authorizationIds, removeAuthorizationIds);
    }

    // 更新角色字段
    return !!(
      await this.roleRepository
        .createQueryBuilder()
        .update()
        .set(this.roleRepository.create(updateByWithout))
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * 删除角色
   */
  async remove(id: number) {
    return !!(
      await this.roleRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * 查询角色关联的用户ids
   */
  async getUserIds(id: number) {
    return (
      await this.roleRepository
        .createQueryBuilder()
        .relation('users')
        .of(id)
        .loadMany<User>()
    ).map((user) => user.id);
  }

  /**
   * 查询角色关联的权限ids
   */
  async getAuthorizationIds(id: number) {
    return (
      await this.roleRepository
        .createQueryBuilder()
        .relation('authorizations')
        .of(id)
        .loadMany<Authorization>()
    ).map((authorization) => authorization.id);
  }

  /**
   * 鉴权
   */
  async isPermitted(userId: number, permitBy: PermitBy) {
    return !!(await this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('role.users', 'user')
      .innerJoin('role.authorizations', 'authorization')
      .where('user.id = :userId', {
        userId,
      })
      .andWhere('authorization.resource = :resource', {
        resource: permitBy.resource,
      })
      .andWhere('authorization.action = :action', {
        action: permitBy.action,
      })
      .getCount());
  }

  /**
   * 获取当前用户对应的权限资源
   */
  async getResourceCodesByUserId(id: number, tenantCode?: string) {
    // 获取当前用户对应的角色 -> 根据角色获取角色关联的权限资源
    const resourceCodes = (
      (await this.roleRepository
        .createQueryBuilder('role')
        .innerJoinAndSelect('role.users', 'user')
        .innerJoinAndSelect('role.authorizations', 'authorization')
        .where('user.id = :userId', {
          userId: id,
        })
        .andWhere('authorization.actionCode = :actionCode', {
          actionCode: AuthorizationActionCode.Retrieve,
        })
        .andWhere(
          tenantCode ? 'authorization.tenantCode = :tenantCode' : '1 = 1',
          {
            tenantCode,
          },
        )
        .select('DISTINCT authorization.resourceCode')
        .execute()) as { resourceCode: AuthorizationResourceCode }[]
    ).map((item) => item.resourceCode);

    return resourceCodes;
  }
}
