// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import type { Repository } from 'typeorm';
// project
import { Role } from './entities/role.entity';
import { paginateQuery } from 'utils/api';
import { AuthorizationActionCode } from '../auth/entities/authorization-action.entity';
import type { AuthorizationResourceCode } from '../auth/entities/authorization-resource.entity';
import type { Authorization } from '../auth/entities/authorization.entity';
import type { User } from '../user/entities/user.entity';
import type { CreateRoleInput } from './dto/create-role.input';
import type { UpdateRoleInput } from './dto/update-role.input';
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
  create(role: CreateRoleInput) {
    return this.roleRepository.save(this.roleRepository.create(role));
  }

  /**
   * 分页查询角色
   */
  getRoles(queryBy?: QueryBy) {
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
  async update(id: number, role: UpdateRoleInput) {
    const { userIds, authorizationIds, ...updateRoleInput } = role;

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
        .set(updateRoleInput)
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
