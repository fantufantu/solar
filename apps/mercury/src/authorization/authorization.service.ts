import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginateQuery } from 'utils/query-builder';
import { Authorization } from '@/libs/database/entities/mercury/authorization.entity';
import type { Query } from 'typings/controller';
import type { FindManyOptions, Repository } from 'typeorm';
import { CreateAuthorizationInput } from './dto/create-authorization.input';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(Authorization)
    private readonly authorizationRepository: Repository<Authorization>,
  ) {}

  /**
   * 分页查询权限
   */
  paginate(query?: Query<Authorization>) {
    return paginateQuery(this.authorizationRepository, query);
  }

  /**
   * 创建权限点
   * 支持管理员在系统中创建权限，创建后支持资源操作的访问控制
   * 注意：已经创建的权限点无法重复创建
   */
  async create(input: CreateAuthorizationInput, who: number) {
    const isCreated = await this.authorizationRepository.existsBy({
      tenantCode: input.tenantCode,
      resourceCode: input.resourceCode,
      actionCode: input.actionCode,
    });

    if (isCreated) {
      throw new Error('权限点已存在，请勿重复创建');
    }

    return await this.authorizationRepository.save(
      this.authorizationRepository.create({
        ...input,
        createdById: who,
      }),
    );
  }

  /**
   * 删除权限点
   * 支持禁用权限点，一旦禁用后，相关资源不在支持访问
   * 需要重新启用权限点时，仅支持重新创建
   */
  async remove(id: number, who: number) {
    const authorization = await this.authorizationRepository.findOneBy({ id });

    if (!authorization) {
      throw new Error('权限点不存在');
    }

    const updatedCount =
      (
        await this.authorizationRepository.update(id, {
          deletedById: who,
          deletedAt: new Date(),
        })
      ).affected ?? 0;

    return updatedCount > 0;
  }
}
