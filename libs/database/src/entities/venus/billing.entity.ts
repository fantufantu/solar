import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { LimitDuration } from 'assets/entities/limit-duration.billing.enum';
import { IdentifiedTracked } from '../any-use/identified-tracked.entity';

@ObjectType()
@Entity()
export class Billing extends IdentifiedTracked {
  @Field(() => String, { description: '账本名称' })
  @Column({
    comment: '账本名称',
    type: 'varchar',
    length: 40,
  })
  name: string;

  @Field(() => LimitDuration, {
    description: '限制时间段',
    nullable: true,
  })
  @Column({
    type: 'enum',
    enum: LimitDuration,
    nullable: true,
    name: 'limit_duration',
    comment: '限制时间段',
  })
  limitDuration: LimitDuration | null;

  @Field(() => Float, { description: '限制金额', nullable: true })
  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    nullable: true,
    name: 'limit_amount',
    comment: '限制金额',
  })
  limitAmount: number | null;
}
