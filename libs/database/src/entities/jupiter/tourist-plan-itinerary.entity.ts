import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimeStamped } from '../any-use/time-stamped.entity';
import { TouristPlan } from './tourist-plan.entity';
import { z } from 'zod';

export const ITINERARY_SCHEMA = z.object({
  name: z.string().describe('行程名称'),
  description: z.string().describe('行程描述'),
  tip: z.string().describe('行程提示'),
  dayFrom: z.number().describe('行程开始第几天，相对于出发日期'),
  duration: z
    .number()
    .describe('行程时长，建议的景点停留时间；Unix 时间戳，单位为毫秒'),
});

@ObjectType({ description: '行程明细项' })
@Entity({ comment: '行程明细', name: 'tourist_plan_itinerary' })
export class TouristPlanItinerary
  extends TimeStamped
  implements z.infer<typeof ITINERARY_SCHEMA>
{
  @Field(() => String, { description: '行程明细`id`' })
  @PrimaryGeneratedColumn('uuid', { comment: '行程明细`id`', name: 'id' })
  id!: string;

  @Field(() => String, { description: '所属出行方案`id`' })
  @Column({
    name: 'tourist_plan_id',
    type: 'varchar',
    length: 36,
    comment: '所属出行方案`id`',
  })
  touristPlanId!: string;

  @ManyToOne(() => TouristPlan, (plan) => plan.itineraries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tourist_plan_id' })
  touristPlan?: TouristPlan;

  @Field(() => Int, { description: '行程开始第几天' })
  @Column({ name: 'day_from', type: 'int', comment: '行程开始第几天' })
  dayFrom!: number;

  @Field(() => Int, { description: '当天排序' })
  @Column({ name: 'sort_order', type: 'int', comment: '当天排序' })
  sortOrder!: number;

  @Field(() => String, { description: '行程名称' })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 128,
    comment: '行程名称',
  })
  name!: string;

  @Field(() => String, { description: '行程描述' })
  @Column({ name: 'description', type: 'text', comment: '行程描述' })
  description!: string;

  @Field(() => String, { description: '行程提示' })
  @Column({ name: 'tip', type: 'text', comment: '行程提示' })
  tip!: string;

  @Field(() => Int, { description: '建议停留时长（Unix 时间戳，单位为毫秒）' })
  @Column({
    name: 'duration',
    type: 'int',
    comment: '建议停留时长（Unix 时间戳，单位为毫秒）',
  })
  duration!: number;
}
