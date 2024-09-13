// nest
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
// third
import { Column, Entity, ManyToOne } from 'typeorm';
// project
import { Preset } from 'assets/entities/preset.entity';
import { Subject } from '../../subject/entities/subject.entity';
import { Billing } from '../../billing/entities/billing.entity';

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
    description: '科目id',
  })
  @Column()
  subjectId: number;

  @ManyToOne(() => Subject)
  subject: Subject;

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
