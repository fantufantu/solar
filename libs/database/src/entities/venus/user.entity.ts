import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Billing } from '@/libs/database/entities/venus/billing.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User {
  @Field(() => Int, {
    description: 'id',
  })
  @PrimaryColumn()
  id: number;

  @Field(() => Int, {
    nullable: true,
    description: '默认账本 id',
  })
  @Column({
    nullable: true,
    name: 'default_billing_id',
    type: 'int',
  })
  defaultBillingId?: number | null;

  @Field(() => Billing, {
    nullable: true,
    description: '默认账本',
  })
  @ManyToOne(() => Billing, {
    nullable: true,
  })
  @JoinColumn({
    name: 'default_billing_id',
    referencedColumnName: 'id',
  })
  defaultBilling?: Billing;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
