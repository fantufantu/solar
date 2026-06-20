import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStamped } from '../any-use/time-stamped.entity';
import { ITINERARY_SCHEMA } from './tourist-plan-itinerary.entity';
import { z } from 'zod';

export const TOURIST_PLAN_SCHEMA = z.object({
  itineraries: z.array(ITINERARY_SCHEMA).describe('行程列表'),
});

@ObjectType()
@Entity({ comment: '出行方案', name: 'tourist_plan' })
export class TouristPlan extends TimeStamped {
  @Field(() => String, {
    description: '出行方案`id`',
  })
  @PrimaryGeneratedColumn('uuid', {
    comment: '出行方案`id`',
    name: 'id',
  })
  id!: string;

  @Field(() => [String], {
    description: '出行目的地城市`code`列表',
  })
  @Column({
    name: 'city_codes',
    type: 'json',
    comment: '出行目的地城市`code`列表',
  })
  cityCodes!: string[];

  @Field(() => Date, {
    description: '出发日期',
  })
  @Column({
    name: 'depature_at',
    comment: '出发日期',
  })
  depatureAt!: Date;

  @Field(() => Int, {
    description: '出行方案持续时间',
  })
  @Column({
    name: 'duration',
    type: 'int',
    comment: '出行方案持续时间',
  })
  duration!: number;

  @Field(() => [String], {
    description: '出行方案包含的景点列表',
  })
  @Column({
    name: 'attraction_codes',
    type: 'json',
    comment: '出行方案包含的景点`code`列表',
  })
  attractionCodes!: string[];

  @Field(() => String, {
    description: '出行方案提案',
  })
  @Column({
    name: 'proposal',
    type: 'mediumtext',
    comment: '出行方案提案',
    nullable: true,
  })
  proposal: string | null = null;

  @Field(() => String, {
    description: '出行方案归属方',
  })
  @Column({
    name: 'belong_to_id',
    type: 'varchar',
    length: 128,
    comment: '出行方案归属方',
    nullable: false,
  })
  belongToId!: string;
}
