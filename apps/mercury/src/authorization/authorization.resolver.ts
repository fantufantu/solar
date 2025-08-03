import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationService } from './authorization.service';
import { PaginatedAuthorizations } from './dto/paginated-authorizations.object';
import { AuthorizeBy } from './dto/authorize-by.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { User } from '@/libs/database/entities/mercury/user.entity';

@Resolver()
export class AuthorizationResolver {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Query(() => PaginatedAuthorizations, {
    description: '分页查询权限',
    name: 'authorizations',
  })
  getAuthorizations() {
    return this.authorizationService.getAuthorizations();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, {
    description: '授权',
  })
  authorize(
    @Args('authorizeBy') authorizeBy: AuthorizeBy,
    @WhoAmI() who: User,
  ) {
    return this.authorizationService.authorize(authorizeBy, who.id);
  }
}
