import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { Preset } from '../any-use/preset.entity';
import { LimitDuration } from 'assets/entities/limit-duration.billing.enum';

@ObjectType()
@Entity()
export class Billing extends Preset {
  @Field(() => String, { description: '账本名称' })
  @Column()
  name: string;

  @Field(() => Int, { description: '账本创建人id' })
  @Column({
    name: 'created_by_id',
  })
  createdById: number;

  @Field(() => LimitDuration, {
    description: '限制时间段',
    nullable: true,
  })
  @Column({
    type: 'enum',
    enum: LimitDuration,
    nullable: true,
    name: 'limit_duration',
  })
  limitDuration: LimitDuration | null;

  @Field(() => Float, { description: '限制金额', nullable: true })
  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    nullable: true,
    name: 'limit_amount',
  })
  limitAmount: number | null;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date | null;
}
