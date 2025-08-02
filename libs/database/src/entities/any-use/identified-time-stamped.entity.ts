import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { TimeStamped } from './time-stamped.entity';

@ObjectType()
export class IdentifiedTimeStamped extends TimeStamped {
  @Field(() => Int, {
    description: 'id',
  })
  @PrimaryGeneratedColumn({
    comment: 'id',
    name: 'id',
  })
  id: number;
}
