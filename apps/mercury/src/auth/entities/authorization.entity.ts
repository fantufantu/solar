// nest
import { Field, ObjectType } from '@nestjs/graphql';
// third
import { Column, DeleteDateColumn, Entity, ManyToOne, Unique } from 'typeorm';
// peoject
import {
  AuthorizationAction,
  AuthorizationActionCode,
} from './authorization-action.entity';
import {
  AuthorizationResource,
  AuthorizationResourceCode,
} from './authorization-resource.entity';
import { Foundation } from 'assets/entities/foundation.entity';
import { Tenant } from '../../tenant/entities/tenant.entity';

@Entity()
@Unique(['tenant', 'resource', 'action'])
@ObjectType({
  description: '权限',
})
export class Authorization extends Foundation {
  @Column()
  tenantCode: string;

  @ManyToOne(() => Tenant, {
    nullable: false,
  })
  tenant: Tenant;

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

  public static uniqueBy(
    tenantCode: string,
    resourceCode: string,
    actionCode: string,
  ) {
    return `${tenantCode}-${resourceCode}-${actionCode}`;
  }
}
