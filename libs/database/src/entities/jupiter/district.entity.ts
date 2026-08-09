import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Authored } from '../any-use/authored.entity';

export enum DistrictLevel {
  CITY = 'city',
  PROVINCE = 'province',
}

registerEnumType(DistrictLevel, {
  name: 'DistrictLevel',
  description: '行政区级别',
});

@ObjectType()
@Entity({ comment: '行政区', name: 'district' })
export class District extends Authored {
  @Field(() => String, { description: '行政区`code`' })
  @PrimaryColumn({ type: 'varchar', length: 40, comment: '行政区`code`' })
  code!: string;

  @Field(() => String, { description: '行政区名称' })
  @Column({ type: 'varchar', length: 40, comment: '行政区名称' })
  name!: string;

  @Field(() => DistrictLevel, { description: '行政区级别' })
  @Column({ type: 'varchar', length: 20, comment: '行政区级别' })
  level!: DistrictLevel;

  @Field(() => String, { description: '行政区代表图' })
  @Column({ type: 'varchar', length: 128, comment: '行政区代表图' })
  image!: string;
}
