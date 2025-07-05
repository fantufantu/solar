import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class PresetUuid {
  @Field(() => String, {
    description: 'id',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Date, {
    description: '创建时间',
  })
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: '更新时间',
  })
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
