import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationService } from './authorization.service';
import { PaginatedAuthorizations } from './dto/paginated-authorizations.object';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { CreateAuthorizationInput } from './dto/create-authorization.input';
import { Authorization } from '@/libs/database/entities/mercury/authorization.entity';

@Resolver()
export class AuthorizationResolver {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Query(() => PaginatedAuthorizations, {
    description: '分页查询权限',
  })
  paginateAuthorizations() {
    return this.authorizationService.paginate();
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
