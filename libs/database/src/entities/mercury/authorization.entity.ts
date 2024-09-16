import { Field, ObjectType } from '@nestjs/graphql';
import { Column, DeleteDateColumn, Entity, ManyToOne, Unique } from 'typeorm';
import {
  AuthorizationAction,
  AuthorizationActionCode,
} from './authorization-action.entity';
import {
  AuthorizationResource,
  AuthorizationResourceCode,
} from './authorization-resource.entity';
import { Preset } from 'assets/entities/preset.entity';

@Entity()
@Unique(['tenantCode', 'resourceCode', 'actionCode'])
@ObjectType({
  description: '权限',
})
export class Authorization extends Preset {
  @Column()
  tenantCode: string;

  @Field(() => AuthorizationResourceCode, {
    description: '资源code',
  })
  @Column({
    type: 'enum',
    enum: AuthorizationResourceCode,
  })
  resourceCode: AuthorizationResourceCode;

  @ManyToOne(() => AuthorizationResource, {
    nullable: false,
  })
  resource: AuthorizationResource;

  @Column({
    type: 'enum',
    enum: AuthorizationActionCode,
  })
  actionCode: AuthorizationActionCode;

  @ManyToOne(() => AuthorizationAction, {
    nullable: false,
  })
  action: AuthorizationAction;

  @DeleteDateColumn()
  deletedAt: Date | null;

  get uniqueBy() {
    return [this.tenantCode, this.resourceCode, this.actionCode].join('-');
  }

  remove() {
    this.deletedAt = new Date();
    return this;
  }
}
