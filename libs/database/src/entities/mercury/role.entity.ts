import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Authorization } from './authorization.entity';
import { User } from './user.entity';
import { IdentifiedTimeStamped } from '../any-use/identified-time-stamped.entity';

@Entity({
  name: 'role',
})
@ObjectType()
export class Role extends IdentifiedTimeStamped {
  @Field(() => String, { description: '角色名称' })
  @Column({
    comment: '角色名称',
  })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable({
    name: 'role_with_user',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @ManyToMany(() => Authorization)
  @JoinTable({
    name: 'role_with_authorization',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'authorization_id',
      referencedColumnName: 'id',
    },
  })
  authorizations: Authorization[];
}
