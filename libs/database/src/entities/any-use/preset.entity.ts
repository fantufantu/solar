import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class Preset {
  @Field(() => Int, {
    description: 'id',
  })
  @PrimaryGeneratedColumn({
    comment: 'id',
    name: 'id',
  })
  id: number;

  @Field(() => Date, {
    description: '创建时间',
  })
  @CreateDateColumn({
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: '更新时间',
  })
  @UpdateDateColumn({
    name: 'updated_at',
    comment: '更新时间',
  })
  updatedAt: Date;
}
