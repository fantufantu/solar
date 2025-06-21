import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Unique } from 'typeorm';
import { MaxLength } from 'class-validator';
import { Preset } from '../any-use/preset.entity';

@ObjectType({
  description: '租户',
})
@Unique(['code'])
@Entity()
export class Tenant extends Preset {
  @Field(() => String, { description: '租户代码' })
  @Column()
  @MaxLength(10)
  code: string;

  @Field(() => String, { description: '租户名称' })
  @Column()
  @MaxLength(20)
  name: string;
}
