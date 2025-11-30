import { ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TimeStamped } from '../any-use/time-stamped.entity';
import { Role } from './role.entity';
import { Authorization } from './authorization.entity';

@Entity({ name: 'role_with_authorization' })
@ObjectType()
export class RoleWithAuthorization extends TimeStamped {
  @PrimaryColumn({
    name: 'role_code',
    comment: '角色`code`',
    type: 'varchar',
    length: 20,
  })
  roleCode: string;

  @ManyToOne(() => Role)
  @JoinColumn({ referencedColumnName: 'code', name: 'role_code' })
  role: Role;

  @PrimaryColumn({
    name: 'authorization_id',
    comment: '权限`id`',
  })
  authorizationId: number;

  @ManyToOne(() => Authorization)
  @JoinColumn({ referencedColumnName: 'id', name: 'authorization_id' })
  authorization: Authorization;
}
