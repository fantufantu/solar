import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Tracked } from '../any-use/tracked.entity';

@ObjectType()
@Entity({ comment: '简历模板', name: 'resume_template' })
export class ResumeTemplate extends Tracked {
  @Field(() => String, {
    description: '模板`code`',
  })
  @PrimaryColumn({
    type: 'varchar',
    length: 40,
    comment: '模板`code`',
  })
  code: string;

  @Field(() => String, {
    description: '模板名称',
  })
  @Column({
    type: 'varchar',
    length: 40,
    comment: '模板名称',
  })
  name: string;

  @Field(() => String, {
    description: '模板封面地址',
  })
  @Column({
    type: 'varchar',
    comment: '模板封面地址',
    length: 128,
  })
  cover: string;
}
