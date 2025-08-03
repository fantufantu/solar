import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, Unique } from 'typeorm';
import { IdentifiedTracked } from '../any-use/identified-tracked.entity';
import { GraphQLEnumToken } from 'assets/tokens';

/**
 * @description 权限操作
 */
export enum AuthorizationActionCode {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  All = '*',
}

registerEnumType(AuthorizationActionCode, {
  name: GraphQLEnumToken.AuthorizationActionCode,
  description: '权限操作code',
});

@Entity({
  name: 'authorization',
})
@Unique(['tenantCode', 'resourceCode', 'actionCode'])
@ObjectType({
  description: '权限',
})
export class Authorization extends IdentifiedTracked {
  @Column({
    name: 'tenant_code',
    comment: '租户`code`',
    type: 'varchar',
    length: 40,
  })
  tenantCode: string;

  @Field(() => String, {
    description: '资源`code`',
  })
  @Column({
    name: 'resource_code',
    comment: '资源`code`',
    type: 'varchar',
    length: 40,
  })
  resourceCode: string;

  @Field(() => AuthorizationActionCode, {
    description: '操作`code`',
  })
  @Column({
    type: 'enum',
    enum: AuthorizationActionCode,
    name: 'action_code',
    comment: '操作`code`',
  })
  actionCode: AuthorizationActionCode;

  get uniqueBy() {
    return [this.tenantCode, this.resourceCode, this.actionCode].join('::');
  }
}
