import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Billing } from '../../billing/entities/billing.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User {
  @Field(() => Int, {
    description: 'id',
  })
  @PrimaryColumn()
  id: number;

  @Column({
    nullable: true,
  })
  defaultBillingId?: number;

  @Field(() => Billing, {
    nullable: true,
    description: '默认账本',
  })
  @ManyToOne(() => Billing, {
    nullable: true,
  })
  defaultBilling?: Billing;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}