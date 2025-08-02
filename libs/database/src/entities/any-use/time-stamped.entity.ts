import { Field, ObjectType } from '@nestjs/graphql';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export class TimeStamped {
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
