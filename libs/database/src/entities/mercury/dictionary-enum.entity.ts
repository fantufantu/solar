import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IdentifiedTimeStamped } from '../any-use/identified-time-stamped.entity';
import { Dictionary } from './dictionary.entity';

@Entity({
  name: 'dictionary_enum',
})
@ObjectType()
export class DictionaryEnum extends IdentifiedTimeStamped {
  @Field(() => String, {
    description: 'code',
  })
  @Column({
    type: 'varchar',
    length: 40,
    comment: 'code',
  })
  code: string;

  @Field(() => String, {
    description: '名称',
  })
  @Column({
    type: 'varchar',
    length: 40,
    comment: '名称',
  })
  name: string;

  @Field(() => String, {
    description: '排序值',
  })
  @Column({
    name: 'sort_by',
    comment: '排序值',
  })
  sortBy: number;

  @Field(() => Int, { description: '所属字典`code`' })
  @Column({
    name: 'parent_code',
    comment: '所属字典`code`',
    type: 'varchar',
    length: 40,
  })
  parentCode: number;

  @ManyToOne(() => Dictionary, (dictionary) => dictionary.children)
  @JoinColumn({ referencedColumnName: 'code', name: 'parent_code' })
  parent: Dictionary;
}
