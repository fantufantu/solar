import { AuthorizationActionCode } from '@/libs/database/entities/mercury/authorization.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
class AuthorizationInput {
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
export class AuthorizeInput {
  @Field(() => String, {
    description: '租户code',
  })
  tenantCode: string;

  @Field(() => [AuthorizationInput], {
    description: '权限范围',
  })
  authorizations: AuthorizationInput[];
}
