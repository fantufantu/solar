import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { DictionaryEnum } from './dictionary-enum.entity';
import { TimeStamped } from '../any-use/time-stamped.entity';

@Entity({
  name: 'dictionary',
})
@ObjectType()
export class Dictionary extends TimeStamped {
  @Field(() => String, {
    description: 'code',
  })
  @PrimaryColumn({
    type: 'varchar',
    length: 40,
    comment: 'code',
  })
  code: string;

  @Field(() => String, {
    description: '描述',
  })
  @Column({
    comment: '描述',
  })
  description: string;

  @Field(() => Int, {
    description: '排序',
  })
  @Column({
    name: 'sort_by',
    comment: '排序',
  })
  sortBy: number;

  @OneToMany(() => DictionaryEnum, (dictionaryEnum) => dictionaryEnum.parent)
  children: DictionaryEnum[];
}
