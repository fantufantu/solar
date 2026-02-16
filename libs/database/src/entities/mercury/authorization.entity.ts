import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, Unique } from 'typeorm';
import { IdentifiedTracked } from '../any-use/identified-tracked.entity';
import { GraphQLEnumToken } from 'assets/tokens';
import { SYSTEM_WILDCARD } from 'constants/common';

/**
 * 权限-操作枚举
 * 分：增、查、改、删、`ALL`
 * `ALL` 比较特殊，表示拥有对整个资源的操作权限
 */
export enum AuthorizationActionCode {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  All = 'all',
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
  @Field(() => String, {
    description: '租户`code`',
  })
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
    return [this.tenantCode, this.resourceCode, this.actionCode].join(
      SYSTEM_WILDCARD.SEPARATOR,
    );
  }
}
