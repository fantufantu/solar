// nest
import { Field, Int, ObjectType } from '@nestjs/graphql';
// third
import { Column, Entity, ManyToOne } from 'typeorm';
// project
import { Dictionary } from '.';
import { Foundation } from 'assets/entities/foundation.entity';

@Entity()
@ObjectType()
export class DictionaryEnum extends Foundation {
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
  @Column()
  sortBy: number;

  @Field(() => Int, { description: '所属字典id' })
  @Column()
  parentId: number;

  @ManyToOne(() => Dictionary, (dictionary) => dictionary.children)
  parent: Dictionary;
}
