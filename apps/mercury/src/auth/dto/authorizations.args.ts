// nest
import { ArgsType, Field, InputType } from '@nestjs/graphql';
// project
import { AuthorizationActionCode } from '../entities/authorization-action.entity';
import { AuthorizationResourceCode } from '../entities/authorization-resource.entity';

@InputType()
class AuthorizationInput {
  @Field(() => AuthorizationResourceCode, {
    description: '权限资源code',
  })
  resourceCode: AuthorizationResourceCode;

  @Field(() => [AuthorizationActionCode], {
    description: '权限操作codes',
  })
  actionCodes: AuthorizationActionCode[];
}

@ArgsType()
export class AuthorizationsArgs {
  @Field(() => String, {
    description: '租户code',
  })
  tenantCode: string;

  @Field(() => [AuthorizationInput], {
    description: '权限分配',
  })
  authorizations: AuthorizationInput[];
}
