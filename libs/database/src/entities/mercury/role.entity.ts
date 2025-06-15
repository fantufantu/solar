import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Preset } from 'assets/entities/preset.entity';
import { Authorization } from './authorization.entity';
import { User } from './user.entity';

@Entity({
  name: 'role',
})
@ObjectType()
export class Role extends Preset {
  @Field(() => String, { description: '角色名称' })
  @Column()
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
