import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStamped } from '../any-use/time-stamped.entity';
import { Attraction } from './attraction.entity';
import { z } from 'zod';

const ITINERARY_ITEM_SCHEMA = z.object({
  itineraryName: z.string().describe('行程名称'),
  itineraryDescription: z.string().describe('行程描述'),
  itineraryTip: z.string().describe('行程提示'),
  itineraryStartAt: z
    .number()
    .describe('行程开始时间；Unix 时间戳，单位为毫秒'),
  itineraryDuration: z
    .number()
    .describe('行程时长，建议的景点停留时间；Unix 时间戳，单位为毫秒'),
});

export const ITINERARY_SCHEMA = z.object({
  items: z.array(ITINERARY_ITEM_SCHEMA).describe('行程列表'),
});

@ObjectType()
class TouristPlanItineraryItem implements z.infer<
  typeof ITINERARY_ITEM_SCHEMA
> {
  @Field(() => String, {
    description: '行程名称',
  })
  itineraryName!: string;

  @Field(() => String, {
    description: '行程描述',
  })
  itineraryDescription!: string;

  @Field(() => String, {
    description: '行程提示',
  })
  itineraryTip!: string;

  @Field(() => Number, {
    description: '行程开始时间',
  })
  itineraryStartAt!: number;

  @Field(() => Number, {
    description: '行程时长',
  })
  itineraryDuration!: number;
}

@ObjectType()
class TouristPlanItinerary implements z.infer<typeof ITINERARY_SCHEMA> {
  @Field(() => [TouristPlanItineraryItem], {
    description: '行程列表',
  })
  items!: TouristPlanItineraryItem[];
}

@ObjectType()
@Entity({ comment: '出行方案', name: 'tourist_plan' })
export class TouristPlan extends TimeStamped {
  @Field(() => String, {
    description: '出行方案`code`',
  })
  @PrimaryGeneratedColumn('uuid', {
    comment: '出行方案`id`',
    name: 'id',
  })
  id!: string;

  @Column({
    name: 'cities',
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
    name: 'attractions',
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

  @Field(() => TouristPlanItinerary, {
    description: '解析后的结构化行程',
    nullable: true,
  })
  @Column({
    name: 'itinerary',
    type: 'json',
    comment: '解析后的结构化行程',
    nullable: true,
  })
  itinerary: TouristPlanItinerary | null = null;

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
