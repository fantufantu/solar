import type { ValueOf } from '@aiszlab/relax/types';
import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Tracked } from '../any-use/tracked.entity';

export const DISTRICT_LEVEL = {
  CITY: 'city',
  PROVINCE: 'province',
} as const;

export type DistrictLevel = ValueOf<typeof DISTRICT_LEVEL>;

@ObjectType()
@Entity({ comment: '行政区', name: 'district' })
export class District extends Tracked {
  @Field(() => String, { description: '行政区`code`' })
  @PrimaryColumn({ type: 'varchar', length: 40, comment: '行政区`code`' })
  code!: string;

  @Field(() => String, { description: '行政区名称' })
  @Column({ type: 'varchar', length: 40, comment: '行政区名称' })
  name!: string;

  @Field(() => String, { description: '行政区级别' })
  @Column({ type: 'varchar', length: 20, comment: '行政区级别' })
  level!: DistrictLevel;

  @Field(() => String, { nullable: true, description: '行政区代表图' })
  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
    comment: '行政区代表图',
  })
  image?: string | null;

  @Field(() => String, { nullable: true, description: '父级行政区`code`' })
  @Column({
    type: 'varchar',
    length: 40,
    name: 'parent_code',
    nullable: true,
    comment: '父级行政区`code`',
  })
  parentCode?: string;
}
