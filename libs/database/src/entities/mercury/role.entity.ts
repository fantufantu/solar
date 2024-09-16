import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Preset } from 'assets/entities/preset.entity';
import { Authorization } from './authorization.entity';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class Role extends Preset {
  @Field(() => String, { description: '角色名称' })
  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable()
  users: User[];

  @ManyToMany(() => Authorization)
  @JoinTable()
  authorizations: Authorization[];
}
