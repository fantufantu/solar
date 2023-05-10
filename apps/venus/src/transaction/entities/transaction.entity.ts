// nest
import {
  ObjectType,
  Field,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
// third
import { Column, Entity, ManyToOne } from 'typeorm';
// project
import { Foundation } from 'assets/entities/foundation.entity';
import { Category } from '../../category/entities/category.entity';
import { Billing } from '../../billing/entities/billing.entity';
import { GraphQLEnumToken } from 'assets/tokens';

/**
 * 交易方向
 */
export enum Direction {
  In = 'in',
  Out = 'out',
}

registerEnumType(Direction, {
  name: GraphQLEnumToken.TransactionDirection,
  description: '交易方向',
});

@ObjectType()
@Entity()
export class Transaction extends Foundation {
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

  @Field(() => Direction, {
    description: '交易方向',
  })
  @Column({
    type: 'enum',
    enum: Direction,
  })
  direction: Direction;

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
