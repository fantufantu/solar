import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationService } from './authorization.service';
import { PaginatedAuthorizations } from './dto/paginated-authorizations.object';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { CreateAuthorizationInput } from './dto/create-authorization.input';
import { Authorization } from '@/libs/database/entities/mercury/authorization.entity';
import { Pagination } from 'assets/dto/pagination.input';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { PaginatedInterceptor } from 'assets/interceptors/paginated.interceptor';

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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Authorization, {
    description: '创建权限点',
  })
  createAuthorization(
    @Args('input') input: CreateAuthorizationInput,
    @WhoAmI() who: User,
  ) {
    return this.authorizationService.create(input, who.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, {
    description: '删除权限点',
  })
  removeAuthorization(
    @Args('id', { type: () => Int }) id: number,
    @WhoAmI() who: User,
  ) {
    return this.authorizationService.remove(id, who.id);
  }
}
