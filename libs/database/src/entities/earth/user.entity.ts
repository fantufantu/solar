import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User as _User } from 'assets/dto/user.object';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User extends _User {
  @Field(() => Int, {
    description: 'id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date, {
    description: '创建时间',
  })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date, {
    description: '更新时间',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
