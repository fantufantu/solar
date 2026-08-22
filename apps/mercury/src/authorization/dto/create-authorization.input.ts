import {
  AUTHORIZATION_ACTION_CODE,
  AUTHORIZATION_RESOURCE_CODE,
  AuthorizationActionCode,
  AuthorizationResourceCode,
} from '@/libs/database/entities/mercury/authorization.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAuthorizationInput {
  @Field(() => AUTHORIZATION_RESOURCE_CODE, {
    description: '权限资源`code`',
  })
  resourceCode!: AuthorizationResourceCode;

  @Field(() => AUTHORIZATION_ACTION_CODE, {
    description: '权限操作`code`',
  })
  actionCode!: AuthorizationActionCode;
}
