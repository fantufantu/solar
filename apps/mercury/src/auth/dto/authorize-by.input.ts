// nest
import { Field, InputType } from '@nestjs/graphql';
// project
import { AuthorizationActionCode } from '../entities/authorization-action.entity';
import { AuthorizationResourceCode } from '../entities/authorization-resource.entity';

@InputType()
class AuthorizeWhat {
  @Field(() => AuthorizationResourceCode, {
    description: '权限资源code',
  })
  resourceCode: AuthorizationResourceCode;

  @Field(() => [AuthorizationActionCode], {
    description: '权限操作codes',
  })
  actionCodes: AuthorizationActionCode[];
}

@InputType()
export class AuthorizeBy {
  @Field(() => String, {
    description: '租户 code',
  })
  tenantCode: string;

  @Field(() => [AuthorizeWhat], {
    description: '权限范围',
  })
  authorizations: AuthorizeWhat[];
}
