import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStamped } from '../any-use/time-stamped.entity';
import { z } from 'zod';

const attractionSchema = z.object({
  attractionName: z.string().describe('景点名称'),
  planAt: z.number().describe('计划游玩开始时间；Unix 时间戳，单位为毫秒'),
  planGap: z
    .number()
    .describe('计划游玩时长，建议的景点停留时间；Unix 时间戳，单位为毫秒'),
  attractionDescription: z.string().describe('景点描述'),
  tip: z.string().describe('出行提示'),
});

export const touristPlanSchema = z.object({
  attractions: z.array(attractionSchema).describe('游玩景点列表'),
});

@ObjectType()
export class City {
  @Field(() => String, {
    description: '出行目的地`code`',
  })
  code!: string;

  @Field(() => String, {
    description: '出行目的地`name`',
  })
  name!: string;
}

@ObjectType()
export class Attraction {
  @Field(() => String, {
    description: '出行景区`id`',
  })
  code!: string;

  @Field(() => String, {
    description: '出行景区`name`',
  })
  name!: string;

  @Field(() => String, {
    description: '出行目的地`code`',
  })
  cityCode!: string;
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

  @Field(() => [City], {
    description: '出行目的地列表',
  })
  @Column({
    name: 'cities',
    type: 'json',
    comment: '出行目的地列表',
  })
  cities!: City[];

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

  @Field(() => [Attraction], {
    description: '出行方案包含的景点列表',
  })
  @Column({
    name: 'attractions',
    type: 'json',
    comment: '出行方案包含的景点列表',
  })
  attractions!: Attraction[];

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
    description: '解析后的结构化出行计划',
    nullable: true,
  })
  @Column({
    name: 'plan',
    type: 'json',
    comment: '解析后的结构化出行计划',
    nullable: true,
  })
  plan: z.infer<typeof touristPlanSchema> | null = null;

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
