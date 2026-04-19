import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStamped } from '../any-use/time-stamped.entity';

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
  belongTo!: string;
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
    type: 'varchar',
    comment: '出行方案提案',
    length: 1024,
  })
  proposal: string | null = null;
}
