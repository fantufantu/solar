import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStamped } from '../any-use/time-stamped.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User extends TimeStamped {
  @Field(() => Int, {
    description: 'id',
  })
  @PrimaryGeneratedColumn()
  id: number;
}
