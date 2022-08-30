// nest
import { ObjectType, Field } from '@nestjs/graphql';

// third
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
// project
import { Foundation } from 'assets/entities/foundation.entity';
import { Authorization } from '../../auth/entities/authorization.entity';
import { User } from '../../auth/entities/user.entity';

@Entity()
@ObjectType()
export class Role extends Foundation {
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
