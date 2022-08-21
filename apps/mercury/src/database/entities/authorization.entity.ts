// nest
import { ObjectType } from '@nestjs/graphql';
// third
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
// peoject
import { Tenant, AuthorizationAction, AuthorizationResource } from '.';
import { AuthorizationActionCode } from './authorization-action.entity';
import { AuthorizationResourceCode } from './authorization-resource.entity';
import { Foundation } from 'assets/entities/foundation.entity';

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

  @Column({
    default: false,
  })
  isDeleted: boolean;
}
