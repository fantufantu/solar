import type { ValueOf } from '@aiszlab/relax/types';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IdentifiedTracked } from '../any-use/identified-tracked.entity';
import { GRAPHQL_ENUM_TOKEN } from 'constants/common.constant';
import { SYSTEM_WILDCARD } from 'constants/common.constant';

/**
 * 权限-操作枚举
 * 分：增、查、改、删、`All`
 * `All` 比较特殊，表示拥有对整个资源的操作权限
 */
export const AUTHORIZATION_ACTION_CODE = {
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete',
  all: 'all',
} as const;

export type AuthorizationActionCode = ValueOf<typeof AUTHORIZATION_ACTION_CODE>;

/**
 * 权限-资源
 */
export const AUTHORIZATION_RESOURCE_CODE = {
  all: 'all',
} as const;

export type AuthorizationResourceCode = ValueOf<
  typeof AUTHORIZATION_RESOURCE_CODE
>;

registerEnumType(AUTHORIZATION_ACTION_CODE, {
  name: GRAPHQL_ENUM_TOKEN.AUTHORIZATION_ACTION_CODE,
  description: '权限操作code',
});

@Entity({
  name: 'authorization',
})
@ObjectType({
  description: '权限',
})
export class Authorization extends IdentifiedTracked {
  @Field(() => String, {
    description: '资源`code`',
  })
  @Column({
    name: 'resource_code',
    comment: '资源`code`',
    type: 'varchar',
    length: 40,
  })
  resourceCode!: string;

  @Field(() => AUTHORIZATION_ACTION_CODE, {
    description: '操作`code`',
  })
  @Column({
    type: 'enum',
    enum: AUTHORIZATION_ACTION_CODE,
    name: 'action_code',
    comment: '操作`code`',
  })
  actionCode!: AuthorizationActionCode;

  get uniqueBy() {
    return [this.resourceCode, this.actionCode].join(SYSTEM_WILDCARD.SEPARATOR);
  }
}
