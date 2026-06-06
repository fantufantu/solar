import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Authored } from '../any-use/authored.entity';

@ObjectType()
@Entity({ comment: '城市', name: 'city' })
export class City extends Authored {
  @Field(() => String, { description: '城市`code`' })
  @PrimaryColumn({ type: 'varchar', length: 40, comment: '城市`code`' })
  code!: string;

  @Field(() => String, { description: '城市名称' })
  @Column({ type: 'varchar', length: 40, comment: '城市名称' })
  name!: string;

  @Field(() => String, { description: '城市代表图' })
  @Column({ type: 'varchar', length: 128, comment: '城市代表图' })
  image!: string;
}
