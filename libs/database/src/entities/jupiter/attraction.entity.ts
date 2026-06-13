import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Authored } from '../any-use/authored.entity';

@ObjectType()
@Entity({ comment: '景区', name: 'attraction' })
export class Attraction extends Authored {
  @Field(() => String, { description: '景区`code`' })
  @PrimaryColumn({ type: 'varchar', length: 40, comment: '景区`code`' })
  code!: string;

  @Field(() => String, { description: '景区名称' })
  @Column({ type: 'varchar', length: 40, comment: '景区名称' })
  name!: string;

  @Field(() => String, { description: '目的地城市`code`' })
  @Column({
    name: 'city_code',
    type: 'varchar',
    length: 40,
    comment: '目的地城市`code`',
  })
  cityCode!: string;

  @Field(() => String, { description: '景点代表图' })
  @Column({
    type: 'varchar',
    length: 128,
    comment: '景点代表图',
  })
  image!: string;
}
