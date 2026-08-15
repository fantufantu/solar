import {
  AUTHORIZATION_ACTION_CODE,
  AuthorizationActionCode,
} from '@/libs/database/entities/mercury/authorization.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAuthorizationInput {
  @Field(() => String, {
    description: '权限资源`code`',
  })
  resourceCode: string;

  @Field(() => AUTHORIZATION_ACTION_CODE, {
    description: '权限操作`code`',
  })
  actionCode: AuthorizationActionCode;
}
