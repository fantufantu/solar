import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStamped } from '../any-use/time-stamped.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User extends TimeStamped {
  @Field(() => Int, {
    description: '用户`id`',
  })
  @PrimaryColumn({
    comment: '用户`id`',
  })
  id: number;
}
