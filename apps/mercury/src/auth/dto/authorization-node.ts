// nest
import { Field, Int, ObjectType } from '@nestjs/graphql';
// project
import { AuthorizationActionCode } from '../entities/authorization-action.entity';
import { AuthorizationResourceCode } from '../entities/authorization-resource.entity';

@ObjectType()
class ActionNode {
  @Field(() => Int, {
    description: '操作节点key',
  })
  key: number;

  @Field(() => String, {
    description: '操作描述',
  })
  title: string;

  @Field(() => AuthorizationActionCode, {
    description: '操作code',
  })
  code: AuthorizationActionCode;
}

@ObjectType()
class ResourceNode {
  @Field(() => String, {
    description: '资源key',
  })
  key: string;

  @Field(() => String, {
    description: '资源描述',
  })
  title: string;

  @Field(() => [ActionNode], {
    description: '操作列表',
  })
  children: ActionNode[];

  @Field(() => AuthorizationResourceCode, {
    description: '资源code',
  })
  code: AuthorizationResourceCode;
}

@ObjectType()
export class AuthorizationNode {
  @Field(() => String, {
    description: '租户key',
  })
  key: string;

  @Field(() => String, {
    description: '租户描述',
  })
  title: string;

  @Field(() => [ResourceNode], {
    description: '资源列表',
  })
  children: ResourceNode[];

  @Field(() => String, {
    description: '租户code',
  })
  code: string;
}
