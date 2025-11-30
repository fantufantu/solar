import { ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { TimeStamped } from '../any-use/time-stamped.entity';
import { Role } from './role.entity';

@Entity({ name: 'role_with_user' })
@ObjectType()
export class RoleWithUser extends TimeStamped {
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
    name: 'user_id',
    comment: '用户`id`',
  })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: 'id', name: 'user_id' })
  user: User;
}
