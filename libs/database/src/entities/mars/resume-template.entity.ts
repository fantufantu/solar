import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Crud } from '../any-use/crud.entity';

@ObjectType()
@Entity({ comment: '简历模板', name: 'resume_template' })
export class ResumeTemplate extends Crud {
  @Field(() => String, {
    description: '模板 code',
  })
  @Column({
    type: 'varchar',
    length: 40,
    comment: '模板 code',
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
    type: 'text',
    comment: '模板封面地址',
  })
  cover: string;
}
