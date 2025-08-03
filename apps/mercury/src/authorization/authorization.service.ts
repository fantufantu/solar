import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginateQuery } from 'utils/query-builder';
import { Authorization } from '@/libs/database/entities/mercury/authorization.entity';
import { AuthorizeBy } from './dto/authorize-by.input';
import type { Query } from 'typings/controller';
import type { Repository } from 'typeorm';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(Authorization)
    private readonly authorizationRepository: Repository<Authorization>,
  ) {}

  /**
   * @description 分页查询权限
   */
  getAuthorizations(query?: Query<Authorization>) {
    return paginateQuery(this.authorizationRepository, query);
  }

  /**
   * @description 分配权限
   */
  async authorize(authorizeBy: AuthorizeBy, who: number) {
    const authorizeds = (
      await this.authorizationRepository.find({
        where: {
          tenantCode: authorizeBy.tenantCode,
        },
      })
    ).reduce((prev, authorization) => {
      authorization.deletedById = who;
      prev.set(authorization.uniqueBy, authorization);
      return prev;
    }, new Map<string, Authorization>());

    authorizeBy.authorizations.forEach((resource) => {
      resource.actionCodes.forEach((actionCode) => {
        const _authorization = this.authorizationRepository.create({
          tenantCode: authorizeBy.tenantCode,
          resourceCode: resource.resourceCode,
          actionCode,
        });

        const _authorized = authorizeds.get(_authorization.uniqueBy);
        if (_authorized) {
          _authorized.deletedAt = null;
          return;
        }

        authorizeds.set(_authorization.uniqueBy, _authorization);
      });
    });

    return (
      (await this.authorizationRepository.save([...authorizeds.values()]))
        .length > 0
    );
  }
}
