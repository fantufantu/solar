import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { IdentifiedTimeStamped } from '../any-use/identified-time-stamped.entity';

@ObjectType()
@Entity({ comment: '会员等级', name: 'membership' })
export class Membership extends IdentifiedTimeStamped {
  @Field(() => String, {
    description: '会员等级名称',
  })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 32,
    comment: '会员等级名称',
  })
  name!: string;

  @Field(() => Int, {
    description: '会员等级额度',
  })
  @Column({
    name: 'quota',
    type: 'int',
    comment: '会员等级额度',
  })
  quota!: number;

  @Field(() => Number, {
    description: '会员等级价格',
  })
  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '会员等级价格',
  })
  price!: number;

  @DeleteDateColumn({
    name: 'deleted_at',
    comment: '删除时间',
  })
  deletedAt: Date | null = null;
}
