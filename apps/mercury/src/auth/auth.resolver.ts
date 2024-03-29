// nest
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// project
import { AuthService } from './auth.service';
import { PaginatedAuthorizations } from './dto/paginated-authorizations';
import { AuthorizationNode } from './dto/authorization-node';
import { AuthorizationResource } from './entities/authorization-resource.entity';
import { AuthorizationAction } from './entities/authorization-action.entity';
import { LoginBy } from './dto/login-by.input';
import { RegisterBy } from './dto/register-by.input';
import { AuthorizeBy } from './dto/authorize-by.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String, { description: '登录' })
  login(@Args('loginBy') loginBy: LoginBy) {
    return this.authService.login(loginBy);
  }

  @Mutation(() => String, { description: '注册' })
  register(@Args('registerBy') registerBy: RegisterBy) {
    return this.authService.register(registerBy);
  }

  @Query(() => PaginatedAuthorizations, {
    description: '分页查询权限',
    name: 'authorizations',
  })
  getAuthorizations() {
    return this.authService.getAuthorizations();
  }

  @Query(() => [AuthorizationNode], {
    description: '查询权限树',
    name: 'authorizationTree',
  })
  getAuthorizationTree() {
    return this.authService.getAuthorizationTree();
  }

  @Query(() => [AuthorizationResource], {
    name: 'authorizationResources',
    description: '权限资源',
  })
  getAuthorizationResources() {
    return this.authService.getAuthorizationResources();
  }

  @Query(() => [AuthorizationAction], {
    name: 'authorizationActions',
    description: '权限操作',
  })
  getAuthorizationActions() {
    return this.authService.getAuthorizationActions();
  }

  @Mutation(() => Boolean, {
    description: '授权',
  })
  authorize(@Args('authorizeBy') authorizeBy: AuthorizeBy) {
    return this.authService.authorize(authorizeBy);
  }
}
