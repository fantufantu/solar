import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Tracked } from './tracked.entity';

@ObjectType()
export class IdentifiedTracked extends Tracked {
  @Field(() => Int, {
    description: 'id',
  })
  @PrimaryGeneratedColumn({
    comment: 'id',
    name: 'id',
  })
  id: number;
}
