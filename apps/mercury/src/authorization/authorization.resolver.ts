import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationService } from './authorization.service';
import { PaginatedAuthorizations } from './dto/paginated-authorizations.object';
import { UseInterceptors } from '@nestjs/common';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { CreateAuthorizationInput } from './dto/create-authorization.input';
import { Authorization } from '@/libs/database/entities/mercury/authorization.entity';
import { Pagination } from 'assets/dto/pagination.input';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { PaginatedInterceptor } from 'utils/interceptors/paginated.interceptor';
import { Authorization as RequireAuthorization } from 'utils/decorators/authorization.decorator';
import {
  AUTHORIZATION_ACTION_CODE,
  AUTHORIZATION_RESOURCE_CODE,
} from '@/libs/database/entities/mercury/authorization.entity';

@Resolver()
export class AuthorizationResolver {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Query(() => PaginatedAuthorizations, {
    description: '分页查询权限',
  })
  @UseInterceptors(PaginatedInterceptor)
  paginateAuthorizations(@PaginationArgs() pagination: Pagination) {
    return this.authorizationService.paginate({
      pagination,
    });
  }

  @Mutation(() => Authorization, {
    description: '创建权限点',
  })
  @RequireAuthorization({
    resource: AUTHORIZATION_RESOURCE_CODE.AUTHORIZATION,
    action: AUTHORIZATION_ACTION_CODE.CREATE,
  })
  createAuthorization(
    @Args('input') input: CreateAuthorizationInput,
    @WhoAmI() who: User,
  ) {
    return this.authorizationService.create(input, who.id);
  }

  @Mutation(() => Boolean, {
    description: '删除权限点',
  })
  @RequireAuthorization({
    resource: AUTHORIZATION_RESOURCE_CODE.AUTHORIZATION,
    action: AUTHORIZATION_ACTION_CODE.DELETE,
  })
  removeAuthorization(
    @Args('id', { type: () => Int }) id: number,
    @WhoAmI() who: User,
  ) {
    return this.authorizationService.remove(id, who.id);
  }
}
