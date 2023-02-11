import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Billing } from '../../billing/entities/billing.entity';

@ObjectType()
@Entity()
export class UserProfile {
  @PrimaryColumn()
  userId: number;

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
}
