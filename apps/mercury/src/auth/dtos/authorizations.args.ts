import { AuthorizationActionCode } from '@app/data-base/entities/boomemory/authorization-action.entity';
import { AuthorizationResourceCode } from '@app/data-base/entities/boomemory/authorization-resource.entity';
import { ArgsType, Field, InputType } from '@nestjs/graphql';

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
