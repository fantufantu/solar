import { Directive, Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { Entity, PrimaryColumn } from 'typeorm';
import { TimeStamped } from '../any-use/time-stamped.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User extends OmitType(
  TimeStamped,
  ['createdAt', 'updatedAt'],
  ObjectType,
) {
  @Field(() => Int, {
    description: '用户`id`',
  })
  @PrimaryColumn({
    comment: '用户`id`',
  })
  id: number;
}
