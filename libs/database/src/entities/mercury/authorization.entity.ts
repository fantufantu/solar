import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import {
  AuthorizationAction,
  AuthorizationActionCode,
} from './authorization-action.entity';
import {
  AuthorizationResource,
  AuthorizationResourceCode,
} from './authorization-resource.entity';
import { IdentifiedTracked } from '../any-use/identified-tracked.entity';

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
  })
  tenantCode: string;

  @Field(() => AuthorizationResourceCode, {
    description: '资源`code`',
  })
  @Column({
    type: 'enum',
    enum: AuthorizationResourceCode,
    name: 'resource_code',
    comment: '资源`code`',
  })
  resourceCode: AuthorizationResourceCode;

  @ManyToOne(() => AuthorizationResource, {
    nullable: false,
  })
  @JoinColumn({ referencedColumnName: 'code', name: 'resource_code' })
  resource: AuthorizationResource;

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

  @ManyToOne(() => AuthorizationAction, {
    nullable: false,
  })
  @JoinColumn({ referencedColumnName: 'code', name: 'action_code' })
  action: AuthorizationAction;

  get uniqueBy() {
    return [this.tenantCode, this.resourceCode, this.actionCode].join('::');
  }
}
