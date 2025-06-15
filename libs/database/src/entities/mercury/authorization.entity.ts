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
import { Preset } from 'assets/entities/preset.entity';

@Entity({
  name: 'authorization',
})
@Unique(['tenantCode', 'resourceCode', 'actionCode'])
@ObjectType({
  description: '权限',
})
export class Authorization extends Preset {
  @Column({
    name: 'tenant_code',
  })
  tenantCode: string;

  @Field(() => AuthorizationResourceCode, {
    description: '资源code',
  })
  @Column({
    type: 'enum',
    enum: AuthorizationResourceCode,
    name: 'resource_code',
  })
  resourceCode: AuthorizationResourceCode;

  @ManyToOne(() => AuthorizationResource, {
    nullable: false,
  })
  @JoinColumn({ referencedColumnName: 'code', name: 'resource_code' })
  resource: AuthorizationResource;

  @Column({
    type: 'enum',
    enum: AuthorizationActionCode,
    name: 'action_code',
  })
  actionCode: AuthorizationActionCode;

  @ManyToOne(() => AuthorizationAction, {
    nullable: false,
  })
  @JoinColumn({ referencedColumnName: 'code', name: 'action_code' })
  action: AuthorizationAction;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date | null;

  get uniqueBy() {
    return [this.tenantCode, this.resourceCode, this.actionCode].join('-');
  }

  remove() {
    this.deletedAt = new Date();
    return this;
  }
}
