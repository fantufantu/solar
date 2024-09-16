import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Preset } from 'assets/entities/preset.entity';
import { Category } from './category.entity';
import { Billing } from './billing.entity';

@ObjectType()
@Entity()
export class Transaction extends Preset {
  @Field(() => Int, {
    description: '账本id',
  })
  @Column()
  billingId: number;

  @ManyToOne(() => Billing)
  billing: Billing;

  @Field(() => Int, {
    description: '分类id',
  })
  @Column()
  categoryId: number;

  @ManyToOne(() => Category)
  category: Category;

  @Field(() => Float, { description: '交易金额' })
  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
  })
  amount: number;

  @Column()
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
  @Column()
  happenedAt: Date;
}
