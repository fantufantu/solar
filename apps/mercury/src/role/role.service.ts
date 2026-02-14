import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type Repository } from 'typeorm';
import { Role } from '@/libs/database/entities/mercury/role.entity';
import { paginateQuery } from 'utils/query-builder';
import {
  Authorization,
  AuthorizationActionCode,
} from '@/libs/database/entities/mercury/authorization.entity';
import type { CreateRoleInput } from './dto/create-role.input';
import type { UpdateRoleInput } from './dto/update-role.input';
import type { Query } from 'typings/controller';
import { RoleWithUser } from '@/libs/database/entities/mercury/role-with-user.entity';
import { AuthorizationService } from '../authorization/authorization.service';
import { RoleWithAuthorization } from '@/libs/database/entities/mercury/role_with_authorization.entity';
import { PermissionPoint } from './dto/permission';
import { SYSTEM_WILDCARD } from 'constants/common';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RoleWithUser)
    private readonly roleWithUserRepository: Repository<RoleWithUser>,
    @InjectRepository(RoleWithAuthorization)
    private readonly roleWithAuthorizationRepository: Repository<RoleWithAuthorization>,
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
    return (
      ((
        await this.roleRepository
          .createQueryBuilder()
          .update()
          .set(this.roleRepository.create(input))
          .where({
            code,
          })
          .execute()
      ).affected ?? 0) > 0
    );
  }

  /**
   * 删除角色
   */
  async remove(code: string) {
    return (
      ((
        await this.roleRepository
          .createQueryBuilder()
          .delete()
          .where({
            code,
          })
          .execute()
      ).affected ?? 0) > 0
    );
  }

  /**
   * 获取指定用户对应的角色`Code`列表
   */
  async yourRoleCodes(who: number) {
    return new Set(
      (
        await this.roleWithUserRepository
          .createQueryBuilder()
          .where({
            userId: who,
          })
          .getMany()
      ).map(({ roleCode }) => roleCode),
    );
  }

  /**
   * 验证指定用户是否包含指定权限点
   * 1. 获取当前用户所拥有的角色
   * 2. 识别角色是否包含对应权限点
   */
  async isAuthorized(
    who: number,
    permissionPoint: PermissionPoint,
  ): Promise<boolean> {
    const roleCodes = await this.yourRoleCodes(who);
    if (roleCodes.size === 0) {
      return false;
    }

    const qb = this.roleWithAuthorizationRepository
      .createQueryBuilder('roleWithAuthorization')
      .innerJoin('roleWithAuthorization.authorization', 'authorization')
      .where('roleWithAuthorization.roleCode IN (:...roleCodes)', {
        roleCodes: Array.from(roleCodes),
      })
      .andWhere('authorization.resourceCode IN (:...resourceCodes)', {
        resourceCodes: [permissionPoint.resource, AuthorizationActionCode.All],
      })
      .andWhere('authorization.actionCode IN (:...actionCodes)', {
        actionCodes: [permissionPoint.action, AuthorizationActionCode.All],
      });

    return (await qb.getCount()) > 0;
  }

  /**
   * 获取当前用户对应的权限点
   * 1. 获取当前用户对应的角色
   * 2. 没有任何角色时，直接按空返回
   * 3. 根据角色获取角色关联的权限资源
   */
  async authorizedList({
    who,
    tenantCode,
  }: {
    who: number;
    tenantCode?: string;
  }) {
    const roleCodes = await this.yourRoleCodes(who);
    if (roleCodes.size === 0) {
      return [];
    }

    const qb = this.roleWithAuthorizationRepository
      .createQueryBuilder('roleWithAuthorization')
      .innerJoinAndSelect(
        'roleWithAuthorization.authorization',
        'authorization',
      )
      .select('authorization.tenantCode', 'tenantCode')
      .addSelect('authorization.resourceCode', 'resourceCode')
      .addSelect('authorization.actionCode', 'actionCode')
      .distinct(true)
      .where('roleWithAuthorization.roleCode IN (:...roleCodes)', {
        roleCodes: Array.from(roleCodes),
      });

    if (tenantCode) {
      qb.andWhere('authorization.tenantCode = :tenantCode', {
        tenantCode,
      });
    }

    const authorizedPoints: Authorization[] = await qb.execute();
    return authorizedPoints;
  }
}
