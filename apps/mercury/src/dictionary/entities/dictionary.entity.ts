// nest
import { ObjectType, Field, Int } from '@nestjs/graphql';
// third
import { Column, Entity, OneToMany } from 'typeorm';
// project
import { Preset } from 'assets/entities/preset.entity';
import { DictionaryEnum } from '../../dictionary-enum/entities/dictionary-enum.entity';

@Entity()
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
  @Column()
  sortBy: number;

  @OneToMany(() => DictionaryEnum, (dictionaryEnum) => dictionaryEnum.parent)
  children: DictionaryEnum[];
}
