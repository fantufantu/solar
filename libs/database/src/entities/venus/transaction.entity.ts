import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Preset } from '../any-use/preset.entity';
import { Category } from './category.entity';
import { Billing } from './billing.entity';

@ObjectType()
@Entity()
export class Transaction extends Preset {
  @Field(() => Int, {
    description: '账本id',
  })
  @Column({
    name: 'billing_id',
  })
  billingId: number;

  @ManyToOne(() => Billing)
  @JoinColumn({
    name: 'billing_id',
    referencedColumnName: 'id',
  })
  billing: Billing;

  @Field(() => Int, {
    description: '分类id',
  })
  @Column({
    name: 'category_id',
  })
  categoryId: number;

  @ManyToOne(() => Category)
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
  })
  category: Category;

  @Field(() => Float, { description: '交易金额' })
  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
  })
  amount: number;

  @Column({
    name: 'created_by_id',
  })
  createdById: number;

  @Field(() => String, {
    description: '备注',
    nullable: true,
  })
  @Column({
    nullable: true,
    type: 'longtext',
  })
  remark: string;

  @Field(() => Date, {
    description: '发生时间',
  })
  @Column({
    name: 'happened_at',
  })
  happenedAt: Date;
}
