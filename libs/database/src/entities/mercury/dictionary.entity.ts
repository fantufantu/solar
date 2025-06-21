import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { Preset } from '../any-use/preset.entity';
import { DictionaryEnum } from './dictionary-enum.entity';

@Entity({
  name: 'dictionary',
})
@ObjectType()
export class Dictionary extends Preset {
  @Field(() => String, {
    description: 'code',
  })
  @Column({
    unique: true,
  })
  code: string;

  @Field(() => String, {
    description: '描述',
  })
  @Column()
  description: string;

  @Field(() => Int, {
    description: '描述',
  })
  @Column({
    name: 'sort_by',
  })
  sortBy: number;

  @OneToMany(() => DictionaryEnum, (dictionaryEnum) => dictionaryEnum.parent)
  children: DictionaryEnum[];
}
