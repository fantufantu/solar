import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { MaxLength } from 'class-validator';
import { TimeStamped } from '../any-use/time-stamped.entity';

@ObjectType({
  description: '租户',
})
@Entity()
export class Tenant extends TimeStamped {
  @Field(() => String, { description: '租户`code`' })
  @PrimaryColumn({
    type: 'varchar',
    length: 40,
    comment: '租户`code`',
  })
  @MaxLength(10)
  code: string;

  @Field(() => String, { description: '租户名称' })
  @Column({
    type: 'varchar',
    length: 40,
    comment: '租户名称',
  })
  @MaxLength(20)
  name: string;
}
