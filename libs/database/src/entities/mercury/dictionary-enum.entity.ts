import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Preset } from 'assets/entities/preset.entity';
import { Dictionary } from './dictionary.entity';

@Entity({
  name: 'dictionary_enum',
})
@ObjectType()
export class DictionaryEnum extends Preset {
  @Field(() => String, {
    description: 'code',
  })
  @Column()
  code: string;

  @Field(() => String, {
    description: '描述',
  })
  @Column()
  description: string;

  @Field(() => String, {
    description: '排序码',
  })
  @Column({
    name: 'sort_by',
  })
  sortBy: number;

  @Field(() => Int, { description: '所属字典id' })
  @Column({
    name: 'parent_id',
  })
  parentId: number;

  @ManyToOne(() => Dictionary, (dictionary) => dictionary.children)
  @JoinColumn({ referencedColumnName: 'id', name: 'parent_id' })
  parent: Dictionary;
}
