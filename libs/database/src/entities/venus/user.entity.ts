import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Billing } from '@/libs/database/entities/venus/billing.entity';
import { TimeStamped } from '../any-use/time-stamped.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User extends TimeStamped {
  @Field(() => Int, {
    description: '用户`id`',
  })
  @PrimaryColumn({
    comment: '用户`id`',
  })
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
}
