import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationService } from './authorization.service';
import { PaginatedAuthorizations } from './dto/paginated-authorizations.object';
import { AuthorizationResource } from '@/libs/database/entities/mercury/authorization-resource.entity';
import { AuthorizationAction } from '@/libs/database/entities/mercury/authorization-action.entity';
import { AuthorizeBy } from './dto/authorize-by.input';

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

  @Query(() => [AuthorizationResource], {
    name: 'authorizationResources',
    description: '权限资源',
  })
  getAuthorizationResources() {
    return this.authorizationService.getAuthorizationResources();
  }

  @Query(() => [AuthorizationAction], {
    name: 'authorizationActions',
    description: '权限操作',
  })
  getAuthorizationActions() {
    return this.authorizationService.getAuthorizationActions();
  }

  @Mutation(() => Boolean, {
    description: '授权',
  })
  authorize(@Args('authorizeBy') authorizeBy: AuthorizeBy) {
    return this.authorizationService.authorize(authorizeBy);
  }
}
