import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type Repository } from 'typeorm';
import { Role } from '@/libs/database/entities/mercury/role.entity';
import { paginateQuery } from 'utils/query-builder';
import {
  AuthorizationActionCode,
  type Authorization,
} from '@/libs/database/entities/mercury/authorization.entity';
import type { CreateRoleInput } from './dto/create-role.input';
import type { UpdateRoleInput } from './dto/update-role.input';
import type { Query } from 'typings/controller';
import { Authorizing } from 'utils/decorators/permission.decorator';
import { RoleWithUser } from '@/libs/database/entities/mercury/role-with-user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RoleWithUser)
    private readonly roleWithUserRepository: Repository<RoleWithUser>,
  ) {}

  /**
   * @description 创建角色
   */
  create(input: CreateRoleInput) {
    return this.roleRepository.save(this.roleRepository.create(input));
  }

  /**
   * 分页查询角色
   */
  roles(query?: Query<Role>) {
    return paginateQuery(this.roleRepository, query);
  }

  /**
   * 查询单个角色
   */
  role(code: string) {
    return this.roleRepository.findOneBy({ code });
  }

  /**
   * @description 更新角色
   */
  async update(
    code: string,
    { userIds, authorizationIds, ...input }: UpdateRoleInput,
  ) {
    // 更新关联的用户
    userIds?.length &&
      (await this.roleRepository
        .createQueryBuilder()
        .relation('users')
        .of(code)
        .add(userIds));

    // 更新关联的权限
    if (authorizationIds) {
      const removeAuthorizationIds = (
        await this.roleRepository
          .createQueryBuilder()
          .relation('authorizations')
          .of(code)
          .loadMany<Authorization>()
      ).map((auth) => auth.id);

      await this.roleRepository
        .createQueryBuilder()
        .relation('authorizations')
        .of(code)
        .addAndRemove(authorizationIds, removeAuthorizationIds);
    }

    // 更新角色字段
    return !!(
      await this.roleRepository
        .createQueryBuilder()
        .update()
        .set(this.roleRepository.create(input))
        .where({
          code,
        })
        .execute()
    ).affected;
  }

  /**
   * 删除角色
   */
  async remove(code: string) {
    return !!(
      await this.roleRepository
        .createQueryBuilder()
        .delete()
        .where({
          code,
        })
        .execute()
    ).affected;
  }

  /**
   * @description 鉴权
   * 1. 如果是资源管理员权限，也认为有权限
   */
  async isAuthorized(who: number, authorizing: Authorizing) {
    const qb = this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('role.users', 'user')
      .innerJoin('role.authorizations', 'authorization')
      .where('user.id = :who', {
        who,
      })
      .andWhere('authorization.resourceCode = :resource', {
        resource: authorizing.resource,
      })
      .andWhere('authorization.actionCode IN (:...actions)', {
        actions: [authorizing.action, AuthorizationActionCode.All],
      });

    return (await qb.getCount()) > 0;
  }

  /**
   * 获取当前用户对应的权限点
   * 1. 获取当前用户对应的角色
   * 2. 根据角色获取角色关联的权限资源
   */
  async authorizedByUserId(id: number, tenantCode?: string) {
    const qb = this.roleWithUserRepository
      .createQueryBuilder('roleWithUser')
      .innerJoinAndSelect('roleWithUser.role', 'role')
      .innerJoinAndSelect('role.authorizations', 'authorization')
      .select('authorization.tenantCode', 'tenantCode')
      .addSelect('authorization.resourceCode', 'resourceCode')
      .addSelect('authorization.actionCode', 'actionCode')
      .distinct(true)
      .where('1 = 1')
      .andWhere('user.id = :userId', {
        userId: id,
      });

    if (tenantCode) {
      qb.andWhere('authorization.tenantCode = :tenantCode', {
        tenantCode,
      });
    }

    return await qb.execute();
  }
}
