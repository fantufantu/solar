import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Billing } from '@/lib/database/entities/venus/billing.entity';

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
  })
  defaultBillingId?: number | null;

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
