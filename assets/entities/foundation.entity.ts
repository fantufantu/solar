// nest
import { Field, Int } from '@nestjs/graphql';
// third
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Foundation {
  @Field(() => Int, {
    description: 'id唯一键',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date, {
    description: '创建日期',
  })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date, {
    description: '上次更新日期',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
