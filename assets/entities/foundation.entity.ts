// nest
import { Field, Int, ObjectType } from '@nestjs/graphql';
// third
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class Foundation {
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
