import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Tracked } from '../any-use/tracked.entity';

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
export class District extends Tracked {
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

  @Field(() => String, { nullable: true, description: '父级行政区`code`' })
  @Column({ type: 'varchar', length: 40, name: 'parent_code', nullable: true, comment: '父级行政区`code`' })
  parentCode?: string;

  @Field(() => District, { nullable: true, description: '父级行政区' })
  @ManyToOne(() => District, (district) => district.children, { nullable: true })
  @JoinColumn({ referencedColumnName: 'code', name: 'parent_code' })
  parent?: District;

  @Field(() => [District], { description: '子级行政区列表' })
  @OneToMany(() => District, (district) => district.parent)
  children!: District[];
}
