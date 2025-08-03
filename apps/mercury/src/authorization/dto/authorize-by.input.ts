import { AuthorizationActionCode } from '@/libs/database/entities/mercury/authorization.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
class AuthorizeWhat {
  @Field(() => String, {
    description: '权限资源code',
  })
  resourceCode: string;

  @Field(() => [AuthorizationActionCode], {
    description: '权限操作codes',
  })
  actionCodes: AuthorizationActionCode[];
}

@InputType()
export class AuthorizeBy {
  @Field(() => String, {
    description: '租户code',
  })
  tenantCode: string;

  @Field(() => [AuthorizeWhat], {
    description: '权限范围',
  })
  authorizations: AuthorizeWhat[];
}
