import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, type Repository } from 'typeorm';
import { Role } from '@/libs/database/entities/mercury/role.entity';
import { paginateQuery } from 'utils/query-builder';
import {
  AuthorizationActionCode,
  type Authorization,
} from '@/libs/database/entities/mercury/authorization.entity';
import type { User } from '@/libs/database/entities/mercury/user.entity';
import type { CreateRoleInput } from './dto/create-role.input';
import type { UpdateRoleInput } from './dto/update-role.input';
import type { Query } from 'typings/controller';
import { Authorizing } from 'utils/decorators/permission.decorator';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * @description 创建角色
   */
  create(input: CreateRoleInput) {
    return this.roleRepository.save(this.roleRepository.create(input));
  }

  /**
   * @description 分页查询角色
   */
  getRoles(query?: Query<Role>) {
    return paginateQuery(this.roleRepository, query);
  }

  /**
   * @description 查询单个角色
   */
  getRole(id: number) {
    return this.roleRepository.findOneBy({ id });
  }

  /**
   * @description 更新角色
   */
  async update(
    id: number,
    { userIds, authorizationIds, ...input }: UpdateRoleInput,
  ) {
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
        .set(this.roleRepository.create(input))
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * @description 删除角色
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
   * @description 查询角色关联的用户`id`列表
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
   * @description 如果是资源管理员权限，也认为有权限
   */
  async isAuthorized(userId: number, authorizing: Authorizing) {
    const qb = this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('role.users', 'user')
      .innerJoin('role.authorizations', 'authorization')
      .where('user.id = :userId', {
        userId,
      })
      .andWhere('authorization.resource = :resource', {
        resource: authorizing.resource,
      })
      .andWhere('authorization.action = :action', {
        action: In([authorizing.action, AuthorizationActionCode.All]),
      });

    return (await qb.getCount()) > 0;
  }

  /**
   * 获取当前用户对应的权限资源
   * @description 获取当前用户对应的角色 -> 根据角色获取角色关联的权限资源
   */
  async getResourceCodesByUserId(id: number, tenantCode?: string) {
    const qb = this.roleRepository
      .createQueryBuilder('role')
      .innerJoinAndSelect('role.users', 'user')
      .innerJoinAndSelect('role.authorizations', 'authorization')
      .select('DISTINCT authorization.resourceCode')
      .where('1 = 1')
      .andWhere('user.id = :userId', {
        userId: id,
      });

    if (tenantCode) {
      qb.andWhere('authorization.tenantCode = :tenantCode', {
        tenantCode,
      });
    }

    return ((await qb.execute()) as { resourceCode: string }[]).map(
      ({ resourceCode }) => resourceCode,
    );
  }
}
